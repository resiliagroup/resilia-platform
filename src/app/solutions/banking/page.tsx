import type { Metadata } from 'next'
import { Leaf } from '@/components/market/Leaf'

export const metadata: Metadata = {
  title: 'Banking & finance',
  description: 'Operational resilience a supervisor can check. BDDK, Basel III, ISO 22301.',
}

export default function Page() {
  return (
    <Leaf
      kicker='Banking & finance'
      statement='Operational resilience a supervisor can check. BDDK, Basel III, ISO 22301.'
      groups={[{ heading: 'The pressure', points: [{ title: 'Scrutiny', text: 'BDDK wants a method, not a self-assessment.' }, { title: 'Dependence', text: 'Branches, payments and the one system that stops the day.' }, { title: 'Hazards together', text: 'Earthquake, flood, cyber and an operational fault in the same week.' }] }, { heading: 'What we deliver', points: [{ title: 'Branch scores', text: 'Every unit, then the concentration across the network.' }, { title: 'Impact', text: 'RTO and RPO from the cost of the hour.' }, { title: 'The file', text: 'A report shaped for BDDK, Basel III and ISO 22301.' }] }]}
      next={{ href: '/solutions', label: 'Back to the work' }}
    />
  )
}
