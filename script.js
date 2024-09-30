const canvas = document.querySelector(".canvas");
const inputSize = document.querySelector(".input-size");
const inputColor = document.querySelector(".input-color");
const usedColors = document.querySelector(".used-colors");
const buttonSave = document.querySelector(".button-save");
const colResize = document.querySelector(".resize");
const main = document.querySelector("main");
const buttonClearAll = document.querySelector(".button-clear-all");
const buttonClearPixel = document.querySelector(".button-clear-pixel");
let eraseMode = false;  

const MIN_CANVAS_SIZE = 4;

let isPainting = false;
let isResizing = false;

// Função para criar elementos
const createElement = (tag, className = "") => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

// Função para definir a cor de um pixel
const setPixelColor = (pixel) => {
    pixel.style.backgroundColor = inputColor.value;
};

// Função para apagar um pixel
const erasePixel = (pixel) => {
    pixel.style.backgroundColor = "#444";  
};

// Função para alternar o modo de apagar
const toggleEraseMode = () => {
    eraseMode = !eraseMode;  // Alterna entre ativado e desativado
    buttonClearPixel.style.backgroundColor = eraseMode ? "#f5b5b5" : "#ebebeb"; // Indica o estado de apagar no botão
};

// Modifica o comportamento de criação de pixel para considerar o modo apagar
const createPixel = () => {
    const pixel = createElement("div", "pixel");

    pixel.addEventListener("mousedown", () => {
        if (eraseMode) {
            erasePixel(pixel);  
        } else {
            setPixelColor(pixel);  
        }
        isPainting = true;
    });

    pixel.addEventListener("mouseover", () => {
        if (isPainting) {
            if (eraseMode) {
                erasePixel(pixel);  // Apaga se estiver no modo apagar
            } else {
                setPixelColor(pixel);  // Pinta se não estiver no modo apagar
            }
        }
    });

    return pixel;
};

// Função para carregar o canvas
const loadCanvas = () => {
    const length = inputSize.value;
    canvas.innerHTML = "";

    for (let i = 0; i < length; i += 1) {
        const row = createElement("div", "row");

        for (let j = 0; j < length; j += 1) {
            row.append(createPixel());
        }

        canvas.append(row);
    }
};

// Função para atualizar o tamanho do canvas
const updateCanvasSize = () => {
    if (inputSize.value >= MIN_CANVAS_SIZE) {
        loadCanvas();
    }
};

// Função para adicionar cor às cores usadas
const changeColor = () => {
    const button = createElement("button", "button-color");
    const currentColor = inputColor.value;

    button.style.backgroundColor = currentColor;
    button.setAttribute("data-color", currentColor);
    button.addEventListener("click", () => (inputColor.value = currentColor));

    const savedColors = Array.from(usedColors.children);
    const check = (btn) => btn.getAttribute("data-color") !== currentColor;

    if (savedColors.every(check)) {
        usedColors.append(button);
    }
};

// Função para redimensionar o canvas
const resizeCanvas = (cursorPositionX) => {
    if (!isResizing) return;

    const canvasOffset = canvas.getBoundingClientRect().left;
    const width = `${cursorPositionX - canvasOffset - 20}px`;

    canvas.style.maxWidth = width;
    colResize.style.height = width;
};

// Função para salvar o canvas como imagem
const saveCanvas = () => {
    html2canvas(canvas).then((image) => {
        const img = image.toDataURL("image/png");
        const link = createElement("a");

        link.href = img;
        link.download = "pixelart.png";

        link.click();
    });
};

// Função para limpar todo o canvas
const clearAll = () => {
    const pixels = document.querySelectorAll(".pixel");
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = "#444";  
    });
};

// Eventos dos novos botões
buttonClearAll.addEventListener("click", clearAll);
buttonClearPixel.addEventListener("click", toggleEraseMode);

// Eventos para pintar e parar de pintar
canvas.addEventListener("mousedown", () => (isPainting = true));
canvas.addEventListener("mouseup", () => (isPainting = false));

// Evento para atualizar o canvas ao mudar o tamanho
inputSize.addEventListener("change", updateCanvasSize);

// Evento para adicionar cores ao histórico de cores usadas
inputColor.addEventListener("change", changeColor);

// Evento para redimensionar o canvas
colResize.addEventListener("mousedown", () => (isResizing = true));
main.addEventListener("mouseup", () => (isResizing = false));
main.addEventListener("mousemove", ({ clientX }) => resizeCanvas(clientX));

// Evento para salvar a imagem
buttonSave.addEventListener("click", saveCanvas);

// Carrega o canvas inicialmente
loadCanvas();