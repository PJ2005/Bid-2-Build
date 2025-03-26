"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface CodeDisplayProps {
  code: string
}

export default function CodeDisplay({ code }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="p-4 rounded-md bg-muted overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={copyToClipboard}>
        <Copy className="h-4 w-4 mr-2" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  )
}

