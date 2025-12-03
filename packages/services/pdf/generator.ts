// SERVICE: PDF Generator
// External integration - PDF generation

// Local definition matching expected input
// We define this here to avoid importing from domain
export interface Proposal {
  leadId: string;
  customerName: string;
  address: string;
  grossCost: number;
  netCostAfterIncentives: number;
  estimatedAnnualSavings: number;
  [key: string]: any;
}

export interface PdfResult {
  pdfBuffer: Buffer;
  fileName: string;
}

/**
 * Generate a PDF proposal
 * Pure service - takes data, returns file buffer
 */
export async function generateProposalPdf(proposal: Proposal): Promise<PdfResult> {
  // In a real implementation, we would use a library like @react-pdf/renderer
  // import { renderToBuffer } from '@react-pdf/renderer';
  // import { ProposalTemplate } from './templates/proposal-template';
  
  // const props = {
  //   homeownerName: proposal.customerName,
  //   address: proposal.address,
  //   grossCost: proposal.grossCost,
  //   netCost: proposal.netCostAfterIncentives,
  //   itcCredit: proposal.grossCost - proposal.netCostAfterIncentives,
  //   estimatedMonthlySavings: proposal.estimatedAnnualSavings / 12,
  // };
  
  // const pdfBuffer = await renderToBuffer(<ProposalTemplate {...props} />);

  // For this service layer implementation without heavy dependencies:
  const pdfBuffer = Buffer.from(`
    %PDF-1.4
    1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
    2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
    3 0 obj <</Type /Page /Parent 2 0 R /Resources <<>> /MediaBox [0 0 612 792] /Contents 4 0 R>> endobj
    4 0 obj <</Length 55>> stream
    BT /F1 24 Tf 100 700 Td (Solar Proposal for ${proposal.customerName}) Tj ET
    endstream endobj
    xref
    0 5
    0000000000 65535 f 
    0000000010 00000 n 
    0000000060 00000 n 
    0000000117 00000 n 
    0000000224 00000 n 
    trailer <</Size 5 /Root 1 0 R>>
    startxref
    329
    %%EOF
  `);

  const fileName = `proposal_${proposal.leadId}_${Date.now()}.pdf`;

  return {
    pdfBuffer,
    fileName,
  };
}
