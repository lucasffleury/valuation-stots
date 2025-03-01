import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ValuationApp() {
  const [faturamento, setFaturamento] = useState("");
  const [investimentos, setInvestimentos] = useState("");
  const [caixa, setCaixa] = useState("");
  const [imobilizado, setImobilizado] = useState("");
  const [data, setData] = useState("");
  const [valuation, setValuation] = useState(null);
  const [historico, setHistorico] = useState(() => {
    const data = localStorage.getItem("historicoValuation");
    return data ? JSON.parse(data) : [];
  });
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  const [mostrarAnalise, setMostrarAnalise] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    localStorage.setItem("historicoValuation", JSON.stringify(historico));
  }, [historico]);

  const parseNumber = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return parseFloat(value.replace(/\./g, "").replace(",", "."))
      .toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calcularValuation = () => {
    const fat = parseNumber(faturamento);
    const inv = parseNumber(investimentos);
    const cxa = parseNumber(caixa);
    const imo = parseNumber(imobilizado);
    
    if (fat <= 0 || inv < 0 || cxa < 0 || imo < 0 || !data) {
      setMensagem("Por favor, insira valores válidos para todos os campos, incluindo a data.");
      return;
    }
    
    const faturamentoAnualAjustado = fat * 2;
    const multiplicadorReceita = faturamentoAnualAjustado * 0.15;
    const valuationBase = multiplicadorReceita * 15;
    const valuationFinal = valuationBase + inv + cxa + imo;
    setValuation(valuationFinal);
    
    const mesAno = data.slice(0, 7); // Pega AAAA-MM
    const novoHistorico = historico.filter(entry => !entry.data.startsWith(mesAno)); // Remove duplicata do mês
    novoHistorico.push({ data, valor: valuationFinal });
    setHistorico(novoHistorico);
  };

  const limparHistorico = () => {
    setHistorico([]);
    setMensagem("Histórico apagado com sucesso.");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-blue-900 min-h-screen text-white">
      <Card className="w-full max-w-md p-6 bg-blue-800 border border-blue-700">
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center text-white">Valuation Stots</h2>
          <p className="text-sm text-gray-300 text-center">
            Insira os valores abaixo para calcular e acompanhar a evolução do valuation do Stots.
          </p>
          <Label className="text-white">Data do Cálculo</Label>
          <Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="text-black" />
          <Label className="text-white">Faturamento do Semestre (R$)</Label>
          <Input type="text" value={faturamento} onChange={(e) => setFaturamento(e.target.value)} onBlur={(e) => setFaturamento(formatCurrency(e.target.value))} className="text-black" />
          <Label className="text-white">Investimentos Recebidos (R$)</Label>
          <Input type="text" value={investimentos} onChange={(e) => setInvestimentos(e.target.value)} onBlur={(e) => setInvestimentos(formatCurrency(e.target.value))} className="text-black" />
          <Label className="text-white">Caixa Disponível (R$)</Label>
          <Input type="text" value={caixa} onChange={(e) => setCaixa(e.target.value)} onBlur={(e) => setCaixa(formatCurrency(e.target.value))} className="text-black" />
          <Label className="text-white">Imobilizado (R$)</Label>
          <Input type="text" value={imobilizado} onChange={(e) => setImobilizado(e.target.value)} onBlur={(e) => setImobilizado(formatCurrency(e.target.value))} className="text-black" />
          <Button onClick={calcularValuation} className="bg-white text-blue-900 font-bold hover:bg-gray-200">Calcular Valuation</Button>
          <Button onClick={limparHistorico} className="bg-red-600 text-white font-bold hover:bg-red-500 mt-2">Limpar Histórico</Button>
          {mensagem && <p className="text-sm text-center text-blue-300 mt-2">{mensagem}</p>}
          {valuation !== null && (
            <p className="text-lg font-semibold text-center mt-4">
              Valor da Empresa: <span className="text-green-400">R$ {valuation.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </p>
          )}
        </CardContent>
      </Card>
      {historico.length > 0 && (
        <div className="w-full max-w-md mt-6">
          <h3 className="text-lg font-bold text-center mb-2 text-white">Histórico de Valuation</h3>
          <ul className="bg-blue-800 p-4 rounded-lg">
            {historico.map((item, index) => (
              <li key={index} className="text-white text-center py-1 border-b border-blue-700">
                {item.data}: R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
