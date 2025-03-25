"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DiscordTextFormatter() {
  const textareaRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [copyMessage, setMessage] = useState("Copy text as Discord formatted")
  const [copyCount, setCopyCount] = useState(0)

  const resetSelection = () => {
    if (textareaRef.current) {
      textareaRef.current.innerHTML = textareaRef.current.innerText
    }
  }

  const applyStyle = (styleClass: string, isBackground = false, color = "") => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === "") return

    const range = selection.getRangeAt(0)
    const selectedText = selection.toString()

    const span = document.createElement("span")
    span.innerText = selectedText

    if (isBackground) {
      span.style.backgroundColor = color
    } else {
      span.className = styleClass
    }

    range.deleteContents()
    range.insertNode(span)

    range.selectNodeContents(span)
    selection.removeAllRanges()
    selection.addRange(range)
  }
  const handleCopy = () => {
    if (!textareaRef.current) return
    const textToCopy = "```ansi\n" + textareaRef.current.innerText + "\n```"
    navigator.clipboard.writeText(textToCopy)

    const copyMessages = [
      "Copied!",
    ]

    const newCount = Math.min(copyCount + 1, copyMessages.length - 1)
    setCopyCount(newCount)
    setMessage(copyMessages[newCount])
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
      setMessage("Copy text as Discord formatted")
      if (newCount > 10) setCopyCount(0)
    }, 2000)
  }


  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault()
      const text = e.clipboardData?.getData("text/plain") || ""
      document.execCommand("insertText", false, text)
    }

    const textarea = textareaRef.current
    textarea?.addEventListener("paste", handlePaste)

    return () => {
      textarea?.removeEventListener("paste", handlePaste)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        document.execCommand("insertLineBreak")
      }
    }

    const textarea = textareaRef.current
    textarea?.addEventListener("keydown", handleKeyDown)

    return () => {
      textarea?.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="flex flex-col items-center p-4 bg-[#36393F] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Create your text</h1>

      <div className="mb-4 space-x-2">
        <Button variant="secondary" onClick={resetSelection} className="bg-[#4f545c] hover:bg-[#5d6269] text-white">
          Reset All
        </Button>
        <Button
          variant="secondary"
          onClick={() => applyStyle("font-bold")}
          className="bg-[#4f545c] hover:bg-[#5d6269] text-white font-bold"
        >
          Bold
        </Button>
        <Button
          variant="secondary"
          onClick={() => applyStyle("underline")}
          className="bg-[#4f545c] hover:bg-[#5d6269] text-white underline"
        >
          Line
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="mr-2 font-bold">FG</span>
          {[
            { color: "#4f545c", ansi: "30" },
            { color: "#dc322f", ansi: "31" },
            { color: "#859900", ansi: "32" },
            { color: "#b58900", ansi: "33" },
            { color: "#268bd2", ansi: "34" },
            { color: "#d33682", ansi: "35" },
            { color: "#2aa198", ansi: "36" },
            { color: "#ffffff", ansi: "37" },
          ].map((item, index) => (
            <button
              key={`fg-${index}`}
              onClick={() => applyStyle(`text-[${item.color}]`)}
              className="w-8 h-8 mx-1 rounded"
              style={{ backgroundColor: item.color }}
              aria-label={`Foreground color ${item.ansi}`}
            />
          ))}
        </div>

        <div className="flex items-center">
          <span className="mr-2 font-bold">BG</span>
          {[
            { color: "#002b36", ansi: "40" },
            { color: "#cb4b16", ansi: "41" },
            { color: "#586e75", ansi: "42" },
            { color: "#657b83", ansi: "43" },
            { color: "#839496", ansi: "44" },
            { color: "#6c71c4", ansi: "45" },
            { color: "#93a1a1", ansi: "46" },
            { color: "#fdf6e3", ansi: "47" },
          ].map((item, index) => (
            <button
              key={`bg-${index}`}
              onClick={() => applyStyle("", true, item.color)}
              className="w-8 h-8 mx-1 rounded"
              style={{ backgroundColor: item.color }}
              aria-label={`Background color ${item.ansi}`}
            />
          ))}
        </div>
      </div>

      <div
        ref={textareaRef}
        contentEditable
        className="w-full max-w-[600px] h-[200px] p-2 mb-4 bg-[#2F3136] text-[#B9BBBE] border border-[#202225] rounded-md text-left font-mono text-sm whitespace-pre-wrap overflow-auto"
        suppressContentEditableWarning
      >
        Welcome to <span className="text-[#b58900]">Parshad</span>&apos;s{" "}
        <span className="bg-[#6c71c4] text-white">Discord</span> <span className="text-[#dc322f]">C</span>
        <span className="text-[#859900]">o</span>
        <span className="text-[#b58900]">l</span>
        <span className="text-[#268bd2]">o</span>
        <span className="text-[#d33682]">r</span>
        <span className="text-[#2aa198]">e</span>
        <span className="text-[#ffffff]">d</span> Text Generator!
      </div>

      <Button
        onClick={handleCopy}
        className={cn("transition-colors duration-250", copied ? "bg-[#3BA55D]" : "bg-[#4f545c] hover:bg-[#5d6269]")}
      >
        {copyMessage}
      </Button>
    </div>
  )
}

