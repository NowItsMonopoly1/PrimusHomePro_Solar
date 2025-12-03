import React from 'react';

// Simple interface for the template props
// We define it here to avoid importing from domain if possible, 
// but the prompt says "Proposal object is passed from domain/UI".
// To keep services independent, we'll define a compatible interface or use `any` if strictly no domain imports.
// However, the prompt says "Proposal object is passed from domain/UI -> never modify it."
// I will define a local interface that matches the expected structure to keep it self-contained.

export interface ProposalTemplateProps {
  homeownerName: string;
  address: string;
  grossCost: number;
  netCost: number;
  itcCredit: number;
  estimatedMonthlySavings: number;
}

export const ProposalTemplate: React.FC<ProposalTemplateProps> = ({
  homeownerName,
  address,
  grossCost,
  netCost,
  itcCredit,
  estimatedMonthlySavings,
}) => {
  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', padding: '40px' }}>
      <h1 style={{ color: '#003366' }}>Solar Proposal</h1>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Prepared for:</strong> {homeownerName}</p>
        <p><strong>Address:</strong> {address}</p>
      </div>
      
      <hr />
      
      <div style={{ marginTop: '20px' }}>
        <h2>Financial Summary</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>System Cost (Gross)</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>
                ${grossCost.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Federal Tax Credit (ITC)</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right', color: 'green' }}>
                -${itcCredit.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>Net System Cost</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                ${netCost.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px', backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ margin: 0, color: '#003366' }}>Estimated Monthly Savings</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
          ${estimatedMonthlySavings.toLocaleString()} / month
        </p>
      </div>
      
      <div style={{ marginTop: '40px', fontSize: '12px', color: '#666' }}>
        <p>Primus Home Pro - Solar Division</p>
        <p>This is an estimate. Actual savings may vary.</p>
      </div>
    </div>
  );
};
