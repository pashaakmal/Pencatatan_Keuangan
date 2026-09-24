'use server'

import { createClient } from '@/utils/supabase/server'
import type { Transaction, TransactionInsert, TransactionUpdate } from '@/types/database'

export async function getTransactions(): Promise<Transaction[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error.message)
    return []
  }

  return data as Transaction[]
}

export async function createTransaction(input: TransactionInsert) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return (data as Transaction[])[0]
}

export async function updateTransaction(id: string, input: TransactionUpdate) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const { data: existingTransaction } = await supabase
    .from('transactions')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!existingTransaction) {
    throw new Error('Transaction not found or unauthorized')
  }

  const { data, error } = await supabase
    .from('transactions')
    .update(input)
    .eq('id', id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return (data as Transaction[])[0]
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const { data: existingTransaction } = await supabase
    .from('transactions')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!existingTransaction) {
    throw new Error('Transaction not found or unauthorized')
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}
