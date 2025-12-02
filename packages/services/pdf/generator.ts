// SERVICE: PDF Generator
// External integration - PDF generation (jsPDF, PDFKit, or similar)

export interface ProposalPdfInput {
  proposalId: string;
  customerName: string;
  systemSizeKw: number;
  totalCost: number;
  monthlyPayment: number;
  estimatedSavingsYear1: number;
}

export interface PdfGenerationResult {
  pdfUrl: string; // URL to generated PDF (S3, Vercel Blob, etc.)
  pdfSizeBytes: number;
}

/**
 * Generate PDF proposal document
 * 
 * EXTERNAL INTEGRATION - This generates PDF files
 * Domain logic should NOT be in this file
 */
export async function generateProposalPdf(input: ProposalPdfInput): Promise<PdfGenerationResult> {
  // TODO: Implement PDF generation
  // TODO: Upload to storage (S3, Vercel Blob)
  
  // STUB implementation
  return {
    pdfUrl: `https://storage.example.com/proposals/${input.proposalId}.pdf`,
    pdfSizeBytes: 245000,
  };
}
