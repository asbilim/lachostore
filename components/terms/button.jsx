"use client";
import { useCallback } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";

export function PDFDownloadButton({ children }) {
  const handleDownload = useCallback(() => {
    const input = document.getElementById("terms-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("terms-of-use.pdf");
    });
  }, []);

  return <Button onClick={handleDownload}>{children}</Button>;
}
