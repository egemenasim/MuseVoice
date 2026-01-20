"use client"

import { QRCodeSVG } from "qrcode.react"

interface QRGeneratorProps {
    value: string
    size?: number
}

export function QRGenerator({ value, size = 128 }: QRGeneratorProps) {
    const downloadQR = () => {
        const svg = document.getElementById(`qr-${value}`)
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            const img = new Image()
            img.onload = () => {
                canvas.width = size
                canvas.height = size
                ctx?.drawImage(img, 0, 0)
                const pngFile = canvas.toDataURL("image/png")
                const downloadLink = document.createElement("a")
                downloadLink.download = `QR-${value}.png`
                downloadLink.href = pngFile
                downloadLink.click()
            }
            img.src = "data:image/svg+xml;base64," + btoa(svgData)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG
                    id={`qr-${value}`}
                    value={value}
                    size={size}
                    level={"H"}
                    includeMargin={false}
                />
            </div>
            <button
                onClick={downloadQR}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded-md transition-colors"
            >
                Download PNG
            </button>
        </div>
    )
}
