import { Loader } from "lucide-react"
import React from 'react'

const loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
        <Loader className="size-6 text-muted-foreground animate-spin" />
    </div>
  )
}

export default loading