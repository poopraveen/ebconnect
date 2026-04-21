/**
 * Figma: "Decleration Stack" component
 * Node: 2824:155450
 *
 * Composes the section heading with the correct declaration component per item:
 *  - kind 'as-ad'    → DeclarationAsAD     (Declaration_AS AD)
 *  - kind 'wellness' → DeclarationWellness (Singlife Corporate Wellness Programme Declaration)
 */

import type { Declaration } from '../api/types'
import { useState } from 'react'
import DeclarationAsAD from './DeclarationAsAD'
import DeclarationWellness from './DeclarationWellness'
import DeclarationModal from './DeclarationModal'

interface DeclarationStackProps {
  declarations: Declaration[]
  showErrors?: boolean
  onComplete: (id: string) => void
}

export default function DeclarationStack({
  declarations,
  showErrors = false,
  onComplete,
}: DeclarationStackProps) {
  const [activeDeclaration, setActiveDeclaration] = useState<Declaration | null>(null)

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-semibold font-sans text-text-primary tracking-[0.27px]">
          Please review the following:
        </h3>

        {declarations.map((decl) => {
          if (decl.kind === 'wellness') {
            return (
              <DeclarationWellness
                key={decl.id}
                declaration={decl}
                showError={showErrors}
                onOpenDeclaration={setActiveDeclaration}
              />
            )
          }
          // Default: 'as-ad'
          return (
            <DeclarationAsAD
              key={decl.id}
              declaration={decl}
              showError={showErrors}
              onOpenDeclaration={setActiveDeclaration}
            />
          )
        })}
      </div>

      <DeclarationModal
        declaration={activeDeclaration}
        onClose={() => setActiveDeclaration(null)}
        onConfirm={(id) => {
          onComplete(id)
          setActiveDeclaration(null)
        }}
      />
    </>
  )
}
