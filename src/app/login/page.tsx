'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createBrowserClient(
      'https://gqguwgbopgnpwzjwcexl.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550'
    )

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
    } else {
      await supabase.auth.getSession()
      window.location.replace('/hub')
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#060D1A',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#0A1628',border:'1px solid #1E3A5F',borderRadius:16,padding:40,width:360}}>
        <div style={{color:'#fff',fontWeight:800,fontSize:20,marginBottom:4}}>OMNIVERSEL</div>
        <div style={{color:'#64748B',fontSize:12,marginBottom:32}}>Urban Resilience Platform</div>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:16}}>
            <label style={{color:'#94A3B8',fontSize:12,display:'block',marginBottom:6}}>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e-posta@kurum.com"
              required
              style={{width:'100%',background:'#060D1A',border:'1px solid #1E3A5F',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:24}}>
            <label style={{color:'#94A3B8',fontSize:12,display:'block',marginBottom:6}}>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{width:'100%',background:'#060D1A',border:'1px solid #1E3A5F',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <div style={{color:'#EF4444',fontSize:13,marginBottom:16}}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{width:'100%',background:'#2D8A87',border:'none',borderRadius:8,padding:'12px',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer'}}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
