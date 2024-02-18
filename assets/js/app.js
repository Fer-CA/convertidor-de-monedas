const montoInput = document.getElementById("monto");
const monedaSelect = document.getElementById("monedaSelect");
const btn = document.getElementById("btn");
const spanResultado = document.getElementById("resultado");
const urlBase = "https://mindicador.cl/api";
let myChart = null;

btn.addEventListener("click", async () => {
    const { value: pesos } = montoInput;
    const { value: monedaSelected } = monedaSelect;
    try {
        const valorDeLaMoneda = await search(monedaSelected);
        const valorFinal = (pesos / valorDeLaMoneda).toFixed(2);
        spanResultado.innerHTML = `Resultado: $${valorFinal}`;
    } catch (error) {
        alert(`Algo no salió bien: ${error.message}`);
    }
});

async function search(moneda) {
    try {
        const res = await fetch(`${urlBase}/${moneda}`);
        const data = await res.json();
        const { serie } = data;
        const datos = createDataToChart(serie.slice(0, 10).reverse());

        if (myChart) {
            myChart.destroy();
        }

        renderGrafico(datos);
        const [{ valor: valorDeLaMoneda }] = serie;
        return valorDeLaMoneda;
    } catch (error) {
        throw new Error("No se pudo obtener la información de la moneda");
        
    }
}

function createDataToChart(serie) {
    const labels = serie.map(({ fecha }) => formatDate(fecha));
    const data = serie.map(({ valor }) => valor);
    const datasets = [
        {
            label: "Historial últimos 10 días",
            borderColor: "rgb(255, 99, 132)", 
            data,
        },
    ];
    return { labels, datasets };
}

function renderGrafico(data) {
    const config = {
        type: "line",
        data,
    };
    const canvas = document.getElementById("myChart");

    canvas.style.backgroundColor = "white";

    if (myChart) {
        myChart.destroy();
    }
    
    myChart = new Chart(canvas, config);
}

function formatDate(date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
}

