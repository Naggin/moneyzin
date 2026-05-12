import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  brand: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#10b981" },
  brandSub: { fontSize: 10, color: "#6b7280", marginTop: 3 },
  headerRight: { alignItems: "flex-end" },
  headerPeriod: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#111827" },
  headerDate: { fontSize: 9, color: "#9ca3af", marginTop: 3 },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginBottom: 20 },
  summaryRow: { flexDirection: "row", marginBottom: 28 },
  summaryCard: { flex: 1, padding: 14, backgroundColor: "#f9fafb", borderRadius: 6, marginRight: 10 },
  summaryCardLast: { flex: 1, padding: 14, backgroundColor: "#f9fafb", borderRadius: 6 },
  summaryLabel: { fontSize: 9, color: "#6b7280", marginBottom: 5, fontFamily: "Helvetica" },
  summaryIncome: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#10b981" },
  summaryExpense: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#ef4444" },
  summaryBalance: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#111827" },
  summaryCount: { fontSize: 9, color: "#9ca3af", marginTop: 4 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f3f4f6", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 4, marginBottom: 2 },
  tableRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#f9fafb" },
  tableRowAlt: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#f9fafb", backgroundColor: "#fafafa" },
  colDate: { width: "14%" },
  colDesc: { width: "34%" },
  colCat: { width: "22%" },
  colType: { width: "14%" },
  colVal: { width: "16%", textAlign: "right" },
  thText: { fontFamily: "Helvetica-Bold", color: "#374151", fontSize: 9 },
  tdText: { color: "#374151", fontSize: 9 },
  income: { color: "#10b981", fontFamily: "Helvetica-Bold", fontSize: 9 },
  expense: { color: "#ef4444", fontFamily: "Helvetica-Bold", fontSize: 9 },
  empty: { textAlign: "center", color: "#9ca3af", padding: 24, fontSize: 10 },
  footer: { position: "absolute", bottom: 28, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#d1d5db" },
});

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
}

interface Props {
  transactions: Transaction[];
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
}

export default function PDFDocument({ transactions, month, year, totalIncome, totalExpense }: Props) {
  const balance = totalIncome - totalExpense;
  const periodLabel = `${MONTHS[month - 1]} ${year}`;
  const generatedAt = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  return (
    <Document title={`Moneyzin — ${periodLabel}`} author="Moneyzin">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brand}>Moneyzin</Text>
            <Text style={s.brandSub}>Relatório Mensal de Finanças</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerPeriod}>{periodLabel}</Text>
            <Text style={s.headerDate}>Gerado em {generatedAt}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Summary cards */}
        <View style={s.summaryRow}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>RECEITAS</Text>
            <Text style={s.summaryIncome}>{formatCurrency(totalIncome)}</Text>
            <Text style={s.summaryCount}>
              {transactions.filter(t => t.type === "INCOME").length} transaç{transactions.filter(t => t.type === "INCOME").length === 1 ? "ão" : "ões"}
            </Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>DESPESAS</Text>
            <Text style={s.summaryExpense}>{formatCurrency(totalExpense)}</Text>
            <Text style={s.summaryCount}>
              {transactions.filter(t => t.type === "EXPENSE").length} transaç{transactions.filter(t => t.type === "EXPENSE").length === 1 ? "ão" : "ões"}
            </Text>
          </View>
          <View style={s.summaryCardLast}>
            <Text style={s.summaryLabel}>SALDO</Text>
            <Text style={[s.summaryBalance, { color: balance >= 0 ? "#10b981" : "#ef4444" }]}>
              {formatCurrency(balance)}
            </Text>
            <Text style={s.summaryCount}>{transactions.length} transaç{transactions.length === 1 ? "ão" : "ões"} no total</Text>
          </View>
        </View>

        {/* Table header */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colDate]}>DATA</Text>
          <Text style={[s.thText, s.colDesc]}>DESCRIÇÃO</Text>
          <Text style={[s.thText, s.colCat]}>CATEGORIA</Text>
          <Text style={[s.thText, s.colType]}>TIPO</Text>
          <Text style={[s.thText, s.colVal]}>VALOR</Text>
        </View>

        {/* Table rows */}
        {transactions.length === 0 ? (
          <Text style={s.empty}>Nenhuma transação em {periodLabel.toLowerCase()}.</Text>
        ) : (
          transactions.map((t, i) => (
            <View key={t.id} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tdText, s.colDate]}>
                {new Date(t.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
              </Text>
              <Text style={[s.tdText, s.colDesc]}>{t.description}</Text>
              <Text style={[s.tdText, s.colCat]}>{t.category}</Text>
              <Text style={[t.type === "INCOME" ? s.income : s.expense, s.colType]}>
                {t.type === "INCOME" ? "Receita" : "Despesa"}
              </Text>
              <Text style={[t.type === "INCOME" ? s.income : s.expense, s.colVal]}>
                {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
              </Text>
            </View>
          ))
        )}

        <Text style={s.footer}>
          Moneyzin · Relatório gerado automaticamente · {generatedAt}
        </Text>
      </Page>
    </Document>
  );
}
