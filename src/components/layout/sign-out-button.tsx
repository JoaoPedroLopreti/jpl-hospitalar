"use client"

import { signOut } from "@/app/actions/auth"

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
            Sair
        </button>
    )
}
