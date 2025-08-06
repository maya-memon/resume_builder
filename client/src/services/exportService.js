import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

class ExportService {
  processElementForPDF(originalElement) {
    const clonedElement = originalElement.cloneNode(true);

    clonedElement.style.transform = 'none';
    clonedElement.style.transformOrigin = 'initial';
    clonedElement.style.scale = '1';

    clonedElement.style.width = 'auto';
    clonedElement.style.maxWidth = '794px';
    clonedElement.style.minHeight = 'auto';
    clonedElement.style.background = '#ffffff';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '20px';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.overflow = 'visible';

    return clonedElement;
  }

  cleanUnsupportedColors(container) {
    const elements = container.querySelectorAll('*');
    elements.forEach((el) => {
      if (el.style.cssText && el.style.cssText.includes('oklch')) {
        el.style.cssText = el.style.cssText.replace(/oklch\([^)]+\)/g, '#000');
      }

      const cs = window.getComputedStyle(el);
      if (cs.color.includes('oklch')) el.style.color = '#000';
      if (cs.backgroundColor.includes('oklch')) el.style.backgroundColor = '#fff';
      if (cs.borderColor.includes('oklch')) el.style.borderColor = '#ccc';
    });
  }

  async exportToPDF(filename = 'resume.pdf') {
    try {
      const element = document.getElementById('resume-preview');
      if (!element) throw new Error('Resume preview element not found');

      const processedElement = this.processElementForPDF(element);

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.minHeight = '1100px';
      tempContainer.style.background = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '14px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000000';

      tempContainer.appendChild(processedElement);
      document.body.appendChild(tempContainer);

      await new Promise(resolve => setTimeout(resolve, 1500));

      this.cleanUnsupportedColors(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        removeContainer: false,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              font-family: Arial, sans-serif !important;
              color: #000000 !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let imgWidth, imgHeight;
      if (imgAspectRatio > pdfAspectRatio) {
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / imgAspectRatio;
      } else {
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * imgAspectRatio;
      }

      const xOffset = (pdfWidth - imgWidth) / 2;
      const yOffset = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(filename);

      return { success: true, message: 'PDF downloaded successfully' };
    } catch (error) {
      console.error('PDF Export Error:', error);
      return { success: false, message: 'Failed to generate PDF: ' + error.message };
    }
  }

  exportToWord(filename = 'resume.docx') {
    const element = document.getElementById('resume-preview');
    if (!element) {
      console.error('Resume preview element not found');
      return;
    }

    const paragraphs = [];

    element.querySelectorAll('*').forEach((node) => {
      const text = node.textContent.trim();
      if (text) {
        const computed = window.getComputedStyle(node);
        const isBold = parseInt(computed.fontWeight) >= 600;
        const fontSize = parseFloat(computed.fontSize.replace('px', ''));

        const run = new TextRun({
          text,
          bold: isBold,
          size: fontSize ? Math.round(fontSize * 2) : 24,
        });

        paragraphs.push(new Paragraph({ children: [run] }));
      }
    });

    const doc = new Document({
      sections: [
        {
          children: paragraphs,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, filename);
      console.log('Word file downloaded');
    }).catch((err) => {
      console.error('Word Export Error:', err);
    });
  }
}

export default new ExportService();
