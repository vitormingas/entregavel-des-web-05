const pedidos = [
    { cliente: "Bia", valor: 120.00, status: "pago" },
    { cliente: "", valor: 50.00, status: "pago" },
    { cliente: "João", valor: -10.00, status: "pago" },
    { cliente: "Carlos", valor: 200.00, status: "pendente" },
    { cliente: "Ana", valor: 80.50, status: "pago" },
    { cliente: "Pedro", valor: "100", status: "pago" }
];

const pedidosValidosPagos = pedidos.filter(p => {
    const clienteValido = p.cliente.trim() !== "";
    const valorValido = typeof p.valor === "number" && p.valor > 0;
    const isPago = p.status === "pago";
    return clienteValido && valorValido && isPago;
});

const totalFaturado = pedidosValidosPagos.reduce((acc, p) => acc + p.valor, 0);

const textosPedidos = pedidosValidosPagos.map(p => `${p.cliente} — R$ ${p.valor.toFixed(2)}`);

console.log("Textos gerados:", textosPedidos);
console.log("Total faturado: R$", totalFaturado.toFixed(2));

const formCep = document.querySelector("#form-cep");
const inputCep = document.querySelector("#input-cep");
const btnCep = document.querySelector("#btn-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const listaHistorico = document.querySelector("#historico-cep");

let historico = [];

formCep.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const cep = inputCep.value.trim();
    const cepRegex = /^\d{8}$/;
    
    if (!cepRegex.test(cep)) {
        statusCep.textContent = "Erro: Digite exatamente 8 números.";
        return;
    }

    statusCep.textContent = "Buscando...";
    btnCep.disabled = true;
    resultadoCep.replaceChildren();

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            throw new Error("Erro de conexão (HTTP " + response.status + ")");
        }

        const data = await response.json();

        if (data.erro) {
            statusCep.textContent = "CEP não encontrado.";