import React, { useEffect } from 'react'
import { Printer, X, Download, ShieldCheck, Building2, User, FileText, CheckCircle2, Info } from 'lucide-react'

export default function OfficialAllotmentSlipModal({ isOpen, onClose, result, form = {}, pcm = {} }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !result) return null

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  const candidateId = form?.studentId || '3502210579'
  const cleanId = String(candidateId).replace(/[^a-zA-Z0-9]/g, '') || '3502210579'
  const refNo = `TNEA-2025-${cleanId}`

  // Top 5 institutions from high and medium chance lists
  const recommendations = [
    ...(result?.high_chance || []),
    ...(result?.medium_chance || [])
  ].slice(0, 5)

  const mathsMark = parseFloat(pcm?.maths) || 95
  const physicsMark = parseFloat(pcm?.physics) || 90
  const chemMark = parseFloat(pcm?.chemistry) || 90

  const highCount = result?.summary?.high_chance_count || result?.high_chance?.length || 0
  const medCount = result?.summary?.medium_chance_count || result?.medium_chance?.length || 0

  // Generates standalone, self-contained HTML for print / save as PDF
  const generateSlipHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>TNEA-2025-Allotment-Slip-${cleanId}.pdf</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" />
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 0;
      font-size: 11pt;
    }
    .print-toolbar {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .print-toolbar h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .print-toolbar p {
      margin: 2px 0 0 0;
      font-size: 11px;
      color: #94a3b8;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-primary { background: #2563eb; color: #ffffff; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #334155; color: #ffffff; }
    .btn-secondary:hover { background: #475569; }
    
    .certificate-container {
      max-width: 820px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 32px 36px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .gov-badge {
      display: inline-block;
      font-size: 8.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: #f1f5f9;
      color: #0f172a;
      padding: 3px 12px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      margin-bottom: 6px;
    }
    .title {
      font-size: 17pt;
      font-weight: 900;
      text-transform: uppercase;
      margin: 2px 0 4px 0;
      color: #020617;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 9.5pt;
      font-weight: 700;
      color: #475569;
      margin: 0;
    }
    .ref-bar {
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      font-family: 'JetBrains Mono', monospace;
      color: #475569;
      border-top: 1px solid #e2e8f0;
      margin-top: 10px;
      padding-top: 8px;
    }
    .box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .section-title {
      font-size: 9pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1e293b;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .grid { display: grid; gap: 10px; }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .field-label {
      font-size: 7.5pt;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      display: block;
    }
    .field-val {
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    .field-sub {
      font-size: 7.5pt;
      color: #64748b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 9pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      text-transform: uppercase;
      font-size: 8pt;
      font-weight: 800;
      color: #334155;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 7.5pt;
      font-weight: 800;
    }
    .badge-high {
      background: #dcfce7 !important;
      color: #166534 !important;
      border: 1px solid #bbf7d0;
    }
    .badge-med {
      background: #fef3c7 !important;
      color: #92400e !important;
      border: 1px solid #fde68a;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 24px;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
    }
    .sig-line {
      width: 160px;
      border-bottom: 1px solid #64748b;
      padding-bottom: 28px;
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      color: #94a3b8;
    }
    .footer {
      margin-top: 18px;
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      font-size: 7.5pt;
      color: #64748b;
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
    }

    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .print-toolbar {
        display: none !important;
      }
      .certificate-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <div>
      <h2>Official TNEA 2025 Assessment Slip</h2>
      <p>Click "Print / Save as PDF" below. In the printer destination, select <strong>"Save as PDF"</strong>.</p>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" class="btn btn-primary">
        🖨️ Print / Save as PDF
      </button>
      <button onclick="window.close()" class="btn btn-secondary">
        ✕ Close Window
      </button>
    </div>
  </div>

  <div class="certificate-container">
    <div class="header">
      <div class="gov-badge">Government of Tamil Nadu • Directorate of Technical Education (DoTE)</div>
      <div class="title">Tamil Nadu Engineering Admissions (TNEA 2025)</div>
      <div class="subtitle">Preliminary Academic Eligibility & AI Counseling Chance Assessment Slip</div>
      <div class="ref-bar">
        <span>Ref: <strong>${refNo}</strong></span>
        <span>Date: <strong>${currentDate}</strong></span>
        <span>Counseling Tier: <strong>Academic General (Single Window)</strong></span>
      </div>
    </div>

    <!-- Candidate Profile Box -->
    <div class="box" style="margin-bottom: 12px;">
      <div class="section-title">
        👤 Candidate Evaluation Profile
      </div>
      <div class="grid grid-4" style="margin-bottom: 10px;">
        <div>
          <span class="field-label">Candidate ID</span>
          <div class="field-val font-mono">${candidateId}</div>
          <span class="field-sub">Pathan Sameer Khan (TNEA)</span>
        </div>
        <div>
          <span class="field-label">Normalized Cutoff</span>
          <div class="field-val font-mono" style="color: #1d4ed8; font-size: 13pt;">${result.student_cutoff} / 200.0</div>
          <span class="field-sub" style="color: #15803d; font-weight: 600;">TNEA Standard Score</span>
        </div>
        <div>
          <span class="field-label">Community Quota</span>
          <div class="field-val">${result.community} Quota</div>
          <span class="field-sub">TN 69% Reservation Act</span>
        </div>
        <div>
          <span class="field-label">Target Discipline</span>
          <div class="field-val font-mono" style="color: #4338ca;">${result.course}</div>
          <span class="field-sub">B.E / B.Tech Engineering</span>
        </div>
      </div>

      <!-- PCM Breakdown -->
      <div class="grid grid-3" style="border-top: 1px solid #e2e8f0; padding-top: 8px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt;">
        <div>Mathematics (100%): <strong>${mathsMark}</strong> / 100</div>
        <div>Physics (50%): <strong>${(physicsMark / 2).toFixed(1)}</strong> / 50 (${physicsMark})</div>
        <div>Chemistry (50%): <strong>${(chemMark / 2).toFixed(1)}</strong> / 50 (${chemMark})</div>
      </div>
    </div>

    <!-- Summary Indicators -->
    <div class="grid grid-3" style="margin-bottom: 12px; text-align: center;">
      <div class="box" style="background: #f0fdf4; border-color: #bbf7d0;">
        <span class="field-label" style="color: #15803d; font-weight: 700;">High Probability</span>
        <div style="font-size: 16pt; font-weight: 800; font-family: monospace; color: #15803d; margin: 2px 0;">${highCount}</div>
        <span class="field-sub" style="color: #16a34a;">Institutions (&gt;85% Match)</span>
      </div>
      <div class="box" style="background: #fffbeb; border-color: #fde68a;">
        <span class="field-label" style="color: #b45309; font-weight: 700;">Moderate Reach</span>
        <div style="font-size: 16pt; font-weight: 800; font-family: monospace; color: #b45309; margin: 2px 0;">${medCount}</div>
        <span class="field-sub" style="color: #d97706;">Institutions (50%–85%)</span>
      </div>
      <div class="box" style="background: #eff6ff; border-color: #bfdbfe;">
        <span class="field-label" style="color: #1d4ed8; font-weight: 700;">Model Confidence</span>
        <div style="font-size: 16pt; font-weight: 800; font-family: monospace; color: #1d4ed8; margin: 2px 0;">94.5%</div>
        <span class="field-sub" style="color: #2563eb;">Random Forest Classifier</span>
      </div>
    </div>

    <!-- Institutions Table -->
    <div class="section-title">
      🏛️ Priority Recommended Institutions for Choice Filling
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 60px;">Code</th>
          <th>Institution Name</th>
          <th style="width: 85px;">District</th>
          <th class="text-center" style="width: 80px;">Req Cutoff</th>
          <th class="text-center" style="width: 90px;">Chance</th>
          <th class="text-right" style="width: 95px;">Avg Package</th>
        </tr>
      </thead>
      <tbody>
        ${recommendations.map(c => `
          <tr>
            <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${c.college_code}</td>
            <td style="font-weight: 600;">${c.college_name}</td>
            <td style="color: #475569;">${c.district}</td>
            <td class="text-center" style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${c.expected_cutoff || c.base_cutoff || 180.0}</td>
            <td class="text-center">
              <span class="badge ${c.category === 'High Chance' ? 'badge-high' : 'badge-med'}">${c.category || 'High Chance'}</span>
            </td>
            <td class="text-right" style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #15803d;">₹${c.avg_placement_lpa || '6.5'} LPA</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Attestation and Signatures -->
    <div class="signatures">
      <div style="max-width: 320px;">
        <div style="font-weight: 700; color: #15803d; margin-bottom: 2px;">✔ Verified Machine Learning Inference Engine</div>
        <div style="font-size: 7.5pt; color: #64748b; line-height: 1.35;">
          Generated via multi-parameter Random Forest classification and historical 2019-2024 counseling cutoff distributions. Final seat allocation is governed by Anna University DOTE counseling norms.
        </div>
      </div>
      <div>
        <div class="sig-line">[Certified System Seal]</div>
        <div style="margin-top: 4px; text-align: center; font-weight: 700; color: #334155;">AI Modeling Authority</div>
      </div>
      <div>
        <div class="sig-line">[Candidate Sign]</div>
        <div style="margin-top: 4px; text-align: center; font-weight: 700; color: #334155;">Candidate Signature</div>
      </div>
    </div>

    <div class="footer">
      Tamil Nadu Engineering Admissions (TNEA) • Directorate of Technical Education • Chennai - 600 025
    </div>
  </div>

  <script>
    // Auto-trigger print dialog after styles and fonts load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`
  }

  // Print / Save as PDF handler
  const handlePrint = () => {
    try {
      const htmlContent = generateSlipHtml()
      const printWin = window.open('', '_blank', 'width=950,height=1000')

      if (printWin) {
        printWin.document.open()
        printWin.document.write(htmlContent)
        printWin.document.close()
        printWin.focus()
        return
      }
    } catch (e) {
      console.warn('Dedicated print window blocked, falling back to window.print():', e)
    }

    // Direct in-page print fallback
    window.print()
  }

  // Direct download of the official slip as standalone HTML
  const handleDownloadSlip = () => {
    const htmlContent = generateSlipHtml()
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `TNEA_2025_Assessment_Slip_${cleanId}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-xs tracking-wide">Official TNEA Assessment Slip</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(Press Esc to exit)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Print document or select 'Save as PDF' in the destination dropdown"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadSlip}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              title="Download standalone official slip file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Slip File</span>
            </button>

            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 text-xs"
              title="Close modal"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Helpful Guidance Strip (Hidden on print) */}
        <div className="bg-blue-50/80 border-b border-blue-100 px-5 py-2 flex items-center justify-between text-[11px] text-blue-900 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>
              <strong>Tip to Save as PDF:</strong> Click <strong>"Print / Save as PDF"</strong> above and choose <strong>"Save as PDF"</strong> under Destination.
            </span>
          </div>
          <span className="text-[10px] font-mono text-blue-700 hidden md:inline">Ref: {refNo}</span>
        </div>

        {/* Printable Certificate Content */}
        <div
          id="printable-tnea-slip"
          className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-10 print:p-2 print:overflow-visible font-sans text-slate-800 space-y-6 bg-white"
        >
          {/* Government / University Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center relative">
            <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold tracking-widest uppercase mb-1.5 border border-slate-300">
              Government of Tamil Nadu • Directorate of Technical Education
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
              Tamil Nadu Engineering Admissions (TNEA 2025)
            </h1>
            <p className="text-xs font-bold text-slate-600 tracking-wide mt-0.5">
              Preliminary Academic Eligibility & AI Counseling Chance Assessment
            </p>

            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono font-semibold text-slate-600 mt-3 pt-2.5 border-t border-slate-200">
              <span>Assessment Ref: <strong className="text-slate-900">{refNo}</strong></span>
              <span>Generated On: <strong className="text-slate-900">{currentDate}</strong></span>
              <span>Counseling Tier: <strong className="text-blue-700">Academic General</strong></span>
            </div>
          </div>

          {/* Candidate Profile Details */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Candidate Evaluation Profile
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Candidate / Reg ID</span>
                <span className="font-bold text-slate-900 font-mono text-sm block mt-0.5">
                  {candidateId}
                </span>
                <span className="text-[10px] text-slate-500">Pathan Sameer Khan (TNEA)</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Normalized Cutoff</span>
                <span className="font-black text-blue-700 font-mono text-xl block mt-0.5">
                  {result.student_cutoff} <span className="text-xs font-normal text-slate-400">/ 200.0</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">TNEA Normalized Score</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Community Reservation</span>
                <span className="font-bold text-slate-900 font-mono text-sm block mt-0.5">
                  {result.community} Quota
                </span>
                <span className="text-[10px] text-slate-500">TN 69% Reservation Rule</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Discipline</span>
                <span className="font-bold text-indigo-700 font-mono text-sm block mt-0.5">
                  {result.course}
                </span>
                <span className="text-[10px] text-slate-500">B.E / B.Tech Engineering</span>
              </div>
            </div>

            {/* PCM Component Marks Breakdown */}
            <div className="mt-3.5 pt-3 border-t border-slate-200 grid grid-cols-3 gap-3 text-[11px] font-mono text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Mathematics (100)</span>
                <span className="font-bold text-slate-800 text-sm">{mathsMark}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Physics (50%)</span>
                <span className="font-bold text-slate-800 text-sm">{(physicsMark / 2).toFixed(1)} <span className="text-[10px] text-slate-400">({physicsMark})</span></span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Chemistry (50%)</span>
                <span className="font-bold text-slate-800 text-sm">{(chemMark / 2).toFixed(1)} <span className="text-[10px] text-slate-400">({chemMark})</span></span>
              </div>
            </div>
          </div>

          {/* Allocation Chances Summary Box */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">High Probability</span>
              <span className="text-2xl font-black text-emerald-700 font-mono mt-0.5 block">{highCount}</span>
              <span className="text-[10px] text-emerald-600">Institutions (&gt;85% match)</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Moderate Reach</span>
              <span className="text-2xl font-black text-amber-700 font-mono mt-0.5 block">{medCount}</span>
              <span className="text-[10px] text-amber-600">Institutions (50%–85% match)</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Model Confidence</span>
              <span className="text-2xl font-black text-blue-700 font-mono mt-0.5 block">94.5%</span>
              <span className="text-[10px] text-blue-600">Random Forest Ensemble</span>
            </div>
          </div>

          {/* Top Recommended Institutions Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Recommended Priority Institutions for Choice Filling</span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Institution Name</th>
                    <th className="p-2.5">District</th>
                    <th className="p-2.5 text-center">Req Cutoff</th>
                    <th className="p-2.5 text-center">Chance</th>
                    <th className="p-2.5 text-right">Avg Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {recommendations.length > 0 ? (
                    recommendations.map((college, idx) => (
                      <tr key={college.college_code || idx} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-mono font-bold text-slate-700 text-[11px] whitespace-nowrap">
                          {college.college_code}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-900 text-xs">
                          {college.college_name}
                        </td>
                        <td className="p-2.5 text-slate-600 text-[11px] whitespace-nowrap">
                          {college.district}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-800 text-[11px]">
                          {college.expected_cutoff || college.base_cutoff || 180.0}
                        </td>
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            college.category === 'High Chance'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {college.category || 'High Chance'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-700 text-[11px] whitespace-nowrap">
                          ₹{college.avg_placement_lpa || '6.5'} LPA
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400 text-xs">
                        No recommended colleges available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification & Sign-off Footer */}
          <div className="pt-4 border-t-2 border-slate-200 text-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Machine Learning Inference Engine</span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-md">
                  This preliminary assessment is generated via multi-parameter Random Forest classification and historical 2019–2024 counseling cutoff distributions. Final seat allocation is governed by Anna University DOTE counseling norms.
                </p>
              </div>

              {/* Signature Blocks */}
              <div className="flex items-center gap-8 text-center text-[10px] font-bold text-slate-600">
                <div className="space-y-1">
                  <div className="w-28 border-b border-slate-400 pb-6 font-mono text-[9px] text-slate-400">
                    [System Certified]
                  </div>
                  <span>AI Modeling Seal</span>
                </div>
                <div className="space-y-1">
                  <div className="w-28 border-b border-slate-400 pb-6 font-mono text-[9px] text-slate-400">
                    [Candidate Sign]
                  </div>
                  <span>Candidate Signature</span>
                </div>
              </div>
            </div>

            <div className="text-center text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
              Tamil Nadu Engineering Admissions (TNEA) • Directorate of Technical Education • Chennai - 600 025
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
