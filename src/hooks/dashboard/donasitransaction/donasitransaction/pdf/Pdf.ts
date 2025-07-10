import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface DonasiTransaction {
    id: string;
    order_id: string;
    donasi_id: number;
    name: string;
    email: string;
    photo_url?: string;
    image_url: string;
    amount: number;
    status: string;
    payment_type?: string;
    transaction_time?: string;
    midtrans_response?: string;
    created_at?: string;
}

interface Donasi {
    id: number;
    title: string;
    slug: string;
}

const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQkSURBVHgB7ZlPbttGFMa/GdJN5NgxWdduswq9i4wUkE9Q6gSx90GtAN3HPkGUE8Q6geXmAJJPIOUEVuogbldWd4UdgBLsoPpDzusbSjHURKEUcZRVfgBFCCKpT2/evPfNCJgTQRHeX78tVWAQG3NAC71q36r1erIFg0gYRgtVkLWwLx2QMirWeGQjWL4AedZCBCFsDwYxHlkC5fR5cTnip5MDgxgVe1EEC1XV+MGSsLLac04fL/kwhFGxArJgC9znXN3X7xeXQ7g/dZ/BEEbF2lAHiuSBFHJFQeU5KZqZpcgPitKIYKNiO70FP2KRClSQkId8fsKTraGA4mURPlJiVmzb+sWGeCFBO72u9YoFV1hsnBJEMoeUGC1drcAqdbqLtZXv+xV7sbfz7/XC/Tt3VQAO7YIYTLw0CBjmpOB4loqKy063Yi8IL7MctglRc62I+ufu4UbihEBi5IljMZPY4OJNQQhrVwqUIwuvXDfbxIyc/nr36a1MWFy910msyVy/62nSwFcEX3BIWpd/VkmpI/fHzamHWo+AHUWHLMMnmu4eQxOMtoUUldbl2Xn73dkhRz5xSP94vLxtq+iEk9DHF2DaG3gcJZ0iBRbe5DQpjqYJR9OJoymwjRkw7g1G8DhNypwm5yy89vfL/SJH83xWoZq5+Nkx+GzBfKRknpE1zjex82JWsQ0+6vjKzCTWXX/YcNayeQqxwfV1j9tLE7MiUM2s9J9Mc2mqNHDvZZsrqw9Kznp2g5tQnoiOphcuGlCU//noaidzpz/VPcZKl7uWrWOYGsG7t9uC5K7ubB9fpw2JJPX84cv3B/hC5jLB3B82q87agx2dJtzR9BDXB59QKZLWxixCNYmRDYITB+Ht3DBqSL72zIuFjjgwnSZ8KutDt9qt369T7SPY4wRKldklxUMYsqui+MvqmEQYegJ2jR1YQ0iUlaTjUeFb5VbqDQ97nEDClJ5tLJQjhQPBhzYzPOmOeXle1hUEKZHB5Sl70tsBC9V55MMsnhDiKbuwk/bF2SFSwms7YWY/SliJTp9Xum2kRCKyEsUSW7p4ok1CTbB+KkXjGCIHM5aSBDvofbeX8HlcCXi4d5OugSXS56x+4QlxnHSRkPJZ8M/bsYKD4E2ODXYNybSmKX+TGJQuKcr8mhgZYYkXPLsfsReoKtV/zfnB0bQfIaSJzl9w/4cBYrH6V7OQOiZXA5+rBu+/2sMdh+lKnOrjOQxw0275a4088GM4quVhJ0vNjVgdXW4GJZiEHZi66uzDEP8zMu7a5l5s80zAQilC3t3YMva/wieuy13fLKSO8Aehhob/A2Mt4iDCbO1mWAHwyJTofWfLtFDNZ/2su54t6+hMJ5pasUheLfDI7Jkc+lES/eyoH433r6T0ENHNPpa0rUApeo3rbmNeAkf5DyuVx1Pq7EjaAAAAAElFTkSuQmCC";

const colors = {
    primary: [52, 152, 219] as [number, number, number],
    secondary: [44, 62, 80] as [number, number, number],
    success: [46, 204, 113] as [number, number, number],
    warning: [241, 196, 15] as [number, number, number],
    danger: [231, 76, 60] as [number, number, number],
    light: [236, 240, 241] as [number, number, number],
    dark: [52, 73, 94] as [number, number, number],
    text: [44, 62, 80] as [number, number, number],
    textLight: [127, 140, 141] as [number, number, number],
    border: [189, 195, 199] as [number, number, number]
};

const getDonasiTitle = (donasiId: number, donasiList: Donasi[]) => {
    const donasi = donasiList.find(d => d.id === donasiId);
    return donasi?.title || `ID: ${donasiId}`;
};

// Helper function to draw status badge (sama seperti Kaka Saku)
const drawStatusBadge = (doc: jsPDF, x: number, y: number, status: string) => {
    const statusColors: Record<string, [number, number, number]> = {
        'pending': [241, 196, 15],
        'success': [46, 204, 113],
        'settlement': [46, 204, 113],
        'failed': [231, 76, 60],
        'completed': [46, 204, 113],
        'cancelled': [231, 76, 60],
    };
    const color = statusColors[status.toLowerCase()] || [127, 140, 141];
    // Selalu gunakan warna teks putih
    const textColor: [number, number, number] = [255, 255, 255];
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const text = status.toUpperCase();
    const textWidth = doc.getTextWidth(text);
    const paddingX = 8;
    const badgeWidth = textWidth + paddingX * 2;
    const badgeHeight = 10;
    doc.setFillColor(color[0], color[1], color[2]);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.roundedRect(x, y, badgeWidth, badgeHeight, 4, 4, 'FD');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(text, x + badgeWidth / 2, y + badgeHeight / 2 + 0.2, { align: 'center', baseline: 'middle' });
};

// Helper function to draw rounded rectangle
const drawRoundedRect = (doc: jsPDF, x: number, y: number, w: number, h: number, r: number, fill: boolean = false) => {
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setFillColor(248, 249, 250); // Very light gray for background
    if (fill) {
        doc.roundedRect(x, y, w, h, r, r, 'FD');
    } else {
        doc.roundedRect(x, y, w, h, r, r, 'D');
    }
};

// Helper untuk mapping status
const getStatusLabel = (status: string) => {
    if (status.toLowerCase() === 'settlement') return 'Success';
    if (status.toLowerCase() === 'success') return 'Success';
    if (status.toLowerCase() === 'pending') return 'Pending';
    if (status.toLowerCase() === 'failed') return 'Failed';
    if (status.toLowerCase() === 'cancelled') return 'Cancelled';
    return status;
};

// Implementasi downloadTransactionPDF dan downloadAllTransactionsPDF akan sama persis dengan versi Kaka Saku, hanya field donasi yang berbeda. 

export const downloadTransactionPDF = (transaction: DonasiTransaction, donasiList: Donasi[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header (centered)
    const logoWidth = 24;
    const logoHeight = 24;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 18;
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    let headerY = logoY + logoHeight + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('Jakarta Mengabdi', pageWidth / 2, headerY, { align: 'center' });
    headerY += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.text('Platform Donasi', pageWidth / 2, headerY, { align: 'center' });
    headerY += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text('Detail Transaksi Donasi', pageWidth / 2, headerY, { align: 'center' });
    headerY += 12;
    doc.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.setLineWidth(0.7);
    doc.line(10, headerY, pageWidth - 10, headerY);
    const cardY = headerY + 6;
    const cardWidth = 170;
    const cardHeight = 120;
    drawRoundedRect(doc, 20, cardY, cardWidth, cardHeight, 8, true);
    const detailY = cardY + 15;
    const labelX = 30;
    const valueX = 100;
    const lineHeight = 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const addDetailRow = (label: string, value: string, y: number) => {
        doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
        doc.setFont('helvetica', 'normal');
        doc.text(label, labelX, y);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(value, valueX, y);
    };
    addDetailRow('Order ID:', transaction.order_id, detailY);
    addDetailRow('Donatur:', transaction.name, detailY + lineHeight);
    addDetailRow('Email:', transaction.email, detailY + lineHeight * 2);
    addDetailRow('Donasi:', getDonasiTitle(transaction.donasi_id, donasiList), detailY + lineHeight * 3);
    addDetailRow('Jumlah:', `Rp ${transaction.amount.toLocaleString()}`, detailY + lineHeight * 4);
    addDetailRow('Tipe Pembayaran:', transaction.payment_type || '-', detailY + lineHeight * 5);
    addDetailRow('Tanggal:', transaction.transaction_time ? new Date(transaction.transaction_time).toLocaleString('id-ID') : '-', detailY + lineHeight * 6);
    // Status badge dengan label mapping
    drawStatusBadge(doc, valueX, detailY + lineHeight * 7, getStatusLabel(transaction.status));
    // Footer
    const footerY = 285;
    doc.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.setLineWidth(0.5);
    doc.line(10, footerY, pageWidth - 10, footerY);
    doc.setFontSize(8);
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('Dokumen ini digenerate secara otomatis oleh sistem Jakarta Mengabdi', pageWidth / 2, footerY + 0, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} Jakarta Mengabdi. All rights reserved.`, pageWidth / 2, footerY + 5, { align: 'center' });
    const pdfFileName = `transaksi-donasi-${transaction.order_id}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(pdfFileName);
    toast.success('PDF berhasil diunduh!');
};

export const downloadAllTransactionsPDF = (
    transactions: DonasiTransaction[],
    donasiList: Donasi[],
    search: string,
    statusFilter: string,
    donasiFilter: string,
    dateFilter: Date | undefined
) => {
    if (transactions.length === 0) {
        toast.error('Tidak ada transaksi untuk diunduh');
        return;
    }
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 2;
    // Tambahkan nomor halaman
    let pageNumber = 1;
    // Table columns
    const columns = [
        { header: 'Order ID', width: 38 },
        { header: 'Donatur', width: 24 },
        { header: 'Email', width: 42 },
        { header: 'Jumlah', width: 32 },
        { header: 'Status', width: 22 },
        { header: 'Tanggal', width: 48 },
    ];
    const tableWidth = columns.reduce((a, c) => a + c.width, 0);
    // Header
    const logoWidth = 24;
    const logoHeight = 24;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = 18;
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    let headerY = logoY + logoHeight + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('Jakarta Mengabdi', pageWidth / 2, headerY, { align: 'center' });
    headerY += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.text('Platform Donasi', pageWidth / 2, headerY, { align: 'center' });
    headerY += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text('Laporan Transaksi Donasi', pageWidth / 2, headerY, { align: 'center' });
    headerY += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.text(`Generated: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, headerY, { align: 'center' });
    headerY += 6;
    doc.text(`Total Transaksi: ${transactions.length}`, pageWidth / 2, headerY, { align: 'center' });
    headerY += 6;
    let filterInfo = '';
    if (search) filterInfo += `Pencarian: "${search}" `;
    if (statusFilter !== 'all') filterInfo += `Status: ${statusFilter} `;
    if (donasiFilter !== 'all') filterInfo += `Donasi: ${getDonasiTitle(parseInt(donasiFilter), donasiList)} `;
    if (dateFilter) filterInfo += `Tanggal: ${dateFilter.toLocaleDateString('id-ID')}`;
    if (filterInfo) {
        doc.text(`Filter: ${filterInfo}`, pageWidth / 2, headerY, { align: 'center' });
        headerY += 6;
    }
    headerY += 4;
    doc.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.setLineWidth(0.7);
    doc.line(10, headerY, pageWidth - 10, headerY);
    const tableY = headerY + 6;
    const rowHeight = 11;
    let y = tableY;
    // Helper: truncate text with ellipsis
    function truncateText(doc: jsPDF, text: string, maxWidth: number) {
        let truncated = text;
        while (doc.getTextWidth(truncated) > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
        }
        if (truncated.length < text.length) {
            truncated = truncated.slice(0, -3) + '...';
        }
        return truncated;
    }
    // Tambahkan nomor halaman di pojok kanan atas
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.text(`Halaman ${pageNumber}`, pageWidth - 20, 15, { align: 'right' });
    // Draw table header
    let x = marginX;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(x, y, tableWidth, rowHeight, 3, 3, 'F');
    columns.forEach(col => {
        doc.text(col.header, x + 2, y + 7);
        x += col.width;
    });
    y += rowHeight;
    // Draw table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    transactions.forEach((trx, idx) => {
        x = marginX;
        if (idx % 2 === 1) {
            doc.setFillColor(245, 247, 250);
            doc.rect(x, y - 1, tableWidth, rowHeight, 'F');
        }
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(truncateText(doc, trx.order_id, columns[0].width - 4), x + 2, y + 7, { maxWidth: columns[0].width - 4 }); x += columns[0].width;
        doc.text(truncateText(doc, trx.name, columns[1].width - 4), x + 2, y + 7, { maxWidth: columns[1].width - 4 }); x += columns[1].width;
        doc.text(truncateText(doc, trx.email, columns[2].width - 4), x + 2, y + 7, { maxWidth: columns[2].width - 4 }); x += columns[2].width;
        doc.text('Rp ' + trx.amount.toLocaleString(), x + 2, y + 7, { maxWidth: columns[3].width - 4 }); x += columns[3].width;
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(truncateText(doc, getStatusLabel(trx.status), columns[4].width - 4), x + 2, y + 7, { maxWidth: columns[4].width - 4 }); x += columns[4].width;
        doc.text(truncateText(doc, trx.transaction_time ? new Date(trx.transaction_time).toLocaleString('id-ID') : '-', columns[5].width - 4), x + 2, y + 7, { maxWidth: columns[5].width - 4 }); x += columns[5].width;
        y += rowHeight;
        if (y + rowHeight > 270) {
            doc.addPage();
            // --- Tambahkan header/logo di sini ---
            const logoWidth = 24;
            const logoHeight = 24;
            const logoX = (pageWidth - logoWidth) / 2;
            const logoY = 18;
            doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
            let headerY = logoY + logoHeight + 10;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.text('Jakarta Mengabdi', pageWidth / 2, headerY, { align: 'center' });
            headerY += 8;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
            doc.text('Platform Donasi', pageWidth / 2, headerY, { align: 'center' });
            headerY += 12;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            doc.text('Laporan Transaksi Donasi', pageWidth / 2, headerY, { align: 'center' });
            headerY += 12;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
            doc.text(`Generated: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, headerY, { align: 'center' });
            headerY += 6;
            doc.text(`Total Transaksi: ${transactions.length}`, pageWidth / 2, headerY, { align: 'center' });
            headerY += 6;
            let filterInfo = '';
            if (search) filterInfo += `Pencarian: "${search}" `;
            if (statusFilter !== 'all') filterInfo += `Status: ${statusFilter} `;
            if (donasiFilter !== 'all') filterInfo += `Donasi: ${getDonasiTitle(parseInt(donasiFilter), donasiList)} `;
            if (dateFilter) filterInfo += `Tanggal: ${dateFilter.toLocaleDateString('id-ID')}`;
            if (filterInfo) {
                doc.text(`Filter: ${filterInfo}`, pageWidth / 2, headerY, { align: 'center' });
                headerY += 6;
            }
            headerY += 4;
            doc.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
            doc.setLineWidth(0.7);
            doc.line(10, headerY, pageWidth - 10, headerY);
            y = headerY + 6;
            // --- Akhir header/logo ---
            // Tambahkan nomor halaman di pojok kanan atas
            pageNumber++;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
            doc.text(`Halaman ${pageNumber}`, pageWidth - 20, 15, { align: 'right' });
            // Redraw table header on new page
            x = marginX;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.roundedRect(x, y, tableWidth, rowHeight, 3, 3, 'F');
            columns.forEach(col => {
                doc.text(col.header, x + 2, y + 7);
                x += col.width;
            });
            y += rowHeight;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
        }
    });
    // Footer
    const footerY = 285;
    doc.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.setLineWidth(0.5);
    doc.line(10, footerY, pageWidth - 10, footerY);
    doc.setFontSize(8);
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('Dokumen ini digenerate secara otomatis oleh sistem Jakarta Mengabdi', pageWidth / 2, footerY + 0, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} Jakarta Mengabdi. All rights reserved.`, pageWidth / 2, footerY + 5, { align: 'center' });
    const fileName = `laporan-transaksi-donasi-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success(`PDF berhasil diunduh! (${transactions.length} transaksi)`);
}; 