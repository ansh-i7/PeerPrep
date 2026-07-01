'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('')
  const [subject, setSubject] = useState('')
  const [availableFrom, setAvailableFrom] = useState('')
  const [availableTo, setAvailableTo] = useState('')
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)
    }
    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!userId) return

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      display_name: displayName,
      subject,
      available_from: availableFrom,
      available_to: availableTo,
    })

    if (error) {
      setError(error.message)
      return
    }

    router.push('/match')
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <h1>Your Study Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Subject (e.g. DSA, DBMS)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
        />
        <label>Available from</label>
        <input
          type="time"
          value={availableFrom}
          onChange={(e) => setAvailableFrom(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
        />
        <label>Available to</label>
        <input
          type="time"
          value={availableTo}
          onChange={(e) => setAvailableTo(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '8px 16px' }}>Save & Find Match</button>
      </form>
    </div>
  )
}