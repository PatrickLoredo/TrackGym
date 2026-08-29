/* =========================================================
   1. CLASSES DE DOMÍNIO (ORIENTAÇÃO A OBJETOS)
========================================================= */

class ExercicioAcademia {
    constructor(id, dataCadastro, nomeExercicio, series, repeticoes, pesoAtual, maiorPeso, dificuldade) {
        this.id = id;
        this.dataCadastro = dataCadastro;
        this.nomeExercicio = nomeExercicio;
        this.series = Number(series);
        this.repeticoes = Number(repeticoes);
        this.pesoAtual = Number(pesoAtual);
        this.maiorPeso = Number(maiorPeso);
        this.dificuldade = dificuldade;
    }
}

class FichaTreino {
    constructor(id, nomeFicha, diaSemana, exerciciosIds = []) {
        this.id = id;
        this.nomeFicha = nomeFicha;
        this.diaSemana = diaSemana;
        this.exerciciosIds = exerciciosIds;
    }
}

/* =========================================================
   2. PERSISTÊNCIA E ESTADO (localStorage)
========================================================= */

const CHAVE_EXERCICIOS = 'trackgym_exercicios_v2';
const CHAVE_FICHAS = 'trackgym_fichas_v2';

let exerciciosCadastrados = carregarExercicios();
let fichasCadastradas = carregarFichas();

function carregarExercicios() {
    const dados = localStorage.getItem(CHAVE_EXERCICIOS);
    if (!dados) return [];
    const objetos = JSON.parse(dados);
    return objetos.map(e => new ExercicioAcademia(
        e.id, e.dataCadastro, e.nomeExercicio, e.series, e.repeticoes, e.pesoAtual, e.maiorPeso, e.dificuldade
    ));
}

function salvarExerciciosStorage() {
    localStorage.setItem(CHAVE_EXERCICIOS, JSON.stringify(exerciciosCadastrados));
}

function carregarFichas() {
    const dados = localStorage.getItem(CHAVE_FICHAS);
    if (!dados) return [];
    const objetos = JSON.parse(dados);
    return objetos.map(f => new FichaTreino(f.id, f.nomeFicha, f.diaSemana, f.exerciciosIds));
}

function salvarFichasStorage() {
    localStorage.setItem(CHAVE_FICHAS, JSON.stringify(fichasCadastradas));
}

/* =========================================================
   3. FUNÇÕES UTILITÁRIAS
========================================================= */

function gerarIdUnico() {
    return 'ex_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

function dataAtualFormatada() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function formatarDataBR(dataIso) {
    if (!dataIso) return '-';
    const partes = dataIso.split('-');
    if (partes.length !== 3) return dataIso;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/* =========================================================
   4. RENDERIZAÇÃO E EDIÇÃO DE EXERCÍCIOS
========================================================= */

function populaBtnExerciciosCadastrados(filtro = '') {
    const container = document.getElementById('containerExercicios');
    if (!container) return;

    container.innerHTML = '';

    const exerciciosFiltrados = exerciciosCadastrados.filter(ex => 
        ex.nomeExercicio.toLowerCase().includes(filtro.toLowerCase())
    );

    if (exerciciosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fa-solid fa-folder-open fa-2x mb-2"></i>
                <p class="tamanho08 uppercase">Nenhum exercício encontrado.</p>
            </div>`;
        return;
    }

    exerciciosFiltrados.forEach(exercicio => {
        const itemHtml = `
            <div class="accordion-item mb-2 border rounded">
                <h2 class="accordion-header" id="heading_${exercicio.id}">
                    <button class="accordion-button collapsed font-button uppercase" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${exercicio.id}">
                        <div class="d-flex justify-content-between align-items-center w-100 me-3">
                            <span><strong>${exercicio.nomeExercicio}</strong></span>
                            <span class="badge bg-secondary tamanho07">${exercicio.series}x${exercicio.repeticoes} - ${exercicio.pesoAtual}KG</span>
                        </div>
                    </button>
                </h2>
                <div id="collapse_${exercicio.id}" class="accordion-collapse collapse" data-bs-parent="#containerExercicios">
                    <div class="accordion-body bg-light" id="modalBody">
                        <div id="exercicio_${exercicio.id}_Descricao">
                            ${gerarCamposEdicaoExercicio(exercicio)}
                        </div>
                        <div class="row mt-3">
                            <div class="col text-end">
                                <button type="button" class="btn btn-warning btn-sm me-2 font-button uppercase" onclick="editaCadastroFinalExercicio('${exercicio.id}')">
                                    <i class="fa fa-pencil me-1"></i> Editar
                                </button>
                                <button type="button" class="btn btn-danger btn-sm me-2 font-button uppercase" onclick="excluirExercicio('${exercicio.id}')">
                                    <i class="fa fa-trash me-1"></i> Excluir
                                </button>
                                <button type="button" class="btn btn-primary btn-sm font-button uppercase" onclick="salvarEdicaoExercicio('${exercicio.id}')">
                                    <i class="fa fa-save me-1"></i> Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });

    atualizarCheckboxesFichas();
}

function gerarCamposEdicaoExercicio(exercicio) {
    return `
        <div class="row">
            <div class="col-md-3 mb-2">
                <label class="labelText">ID</label>
                <input type="text" class="form-control" id="idExercicio_${exercicio.id}" value="${exercicio.id}" disabled>
            </div>
            <div class="col-md-3 mb-2">
                <label class="labelText">Data Cadastro</label>
                <input type="text" class="form-control" id="dataCadastroExercicio_${exercicio.id}" value="${formatarDataBR(exercicio.dataCadastro)}" disabled>
            </div>
            <div class="col-md-3 mb-2">
                <label class="labelText">Séries</label>
                <input type="number" class="form-control" min="1" value="${exercicio.series}" id="seriesExercicio_${exercicio.id}" disabled>
            </div>
            <div class="col-md-3 mb-2">
                <label class="labelText">Repetições</label>
                <input type="number" class="form-control" min="1" value="${exercicio.repeticoes}" id="repeticoesExercicio_${exercicio.id}" disabled>
            </div>
            <div class="col-md-12 mt-2 mb-2">
                <label class="labelText">Nome do Exercício</label>
                <input type="text" class="form-control" value="${exercicio.nomeExercicio}" id="nomeExercicio_${exercicio.id}" disabled>
            </div>
            <div class="col-md-4 mt-2 mb-2">
                <label class="labelText">Maior Peso (KG)</label>
                <input type="number" class="form-control" min="0" step="0.5" value="${exercicio.maiorPeso}" id="maiorPesoExercicio_${exercicio.id}" disabled>
            </div>
            <div class="col-md-4 mt-2 mb-2">
                <label class="labelText">Peso Atual (KG)</label>
                <input type="number" class="form-control" min="0" step="0.5" value="${exercicio.pesoAtual}" id="pesoAtualExercicio_${exercicio.id}" disabled>
            </div>
            <div class="col-md-4 mt-2 mb-2">
                <label class="labelText">Dificuldade</label>
                <select class="form-select" id="dificuldadeExercicio_${exercicio.id}" disabled>
                    <option value="dificuldadeNulo" ${exercicio.dificuldade === 'dificuldadeNulo' ? 'selected' : ''}>-</option>
                    <option value="Fácil" ${exercicio.dificuldade === 'Fácil' ? 'selected' : ''}>Fácil</option>
                    <option value="Normal" ${exercicio.dificuldade === 'Normal' ? 'selected' : ''}>Normal</option>
                    <option value="Difícil" ${exercicio.dificuldade === 'Difícil' ? 'selected' : ''}>Difícil</option>
                </select>
            </div>
        </div>
    `;
}

function editaCadastroFinalExercicio(id) {
    const container = document.getElementById(`exercicio_${id}_Descricao`);
    if (!container) return;

    const inputs = container.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id !== `idExercicio_${id}` && input.id !== `dataCadastroExercicio_${id}`) {
            input.disabled = false;
        }
    });
}

function salvarEdicaoExercicio(id) {
    const exercicio = exerciciosCadastrados.find(e => e.id === id);
    if (!exercicio) return;

    const inputNome = document.getElementById(`nomeExercicio_${id}`);
    if (!inputNome) return;

    const novoNome = inputNome.value.trim();
    if (!novoNome) {
        alert('O nome do exercício não pode ficar em branco!');
        return;
    }

    const novoPesoAtual = Number(document.getElementById(`pesoAtualExercicio_${id}`).value);
    let novoMaiorPeso = Number(document.getElementById(`maiorPesoExercicio_${id}`).value);

    // Ajusta o maior peso automaticamente se o peso atual superar a marca anterior
    if (novoPesoAtual > novoMaiorPeso) {
        novoMaiorPeso = novoPesoAtual;
    }

    exercicio.nomeExercicio = novoNome;
    exercicio.series = Number(document.getElementById(`seriesExercicio_${id}`).value);
    exercicio.repeticoes = Number(document.getElementById(`repeticoesExercicio_${id}`).value);
    exercicio.pesoAtual = novoPesoAtual;
    exercicio.maiorPeso = novoMaiorPeso;
    exercicio.dificuldade = document.getElementById(`dificuldadeExercicio_${id}`).value;

    salvarExerciciosStorage();
    alert('Exercício atualizado com sucesso!');
    populaBtnExerciciosCadastrados(document.getElementById('inputBusca').value);
}

function excluirExercicio(id) {
    if (confirm('Tem certeza que deseja excluir este exercício? Ele também será removido das fichas associadas.')) {
        exerciciosCadastrados = exerciciosCadastrados.filter(e => e.id !== id);
        salvarExerciciosStorage();

        // Limpa a referência nas fichas existentes
        fichasCadastradas.forEach(ficha => {
            ficha.exerciciosIds = ficha.exerciciosIds.filter(exId => exId !== id);
        });
        salvarFichasStorage();

        populaBtnExerciciosCadastrados(document.getElementById('inputBusca').value);
        renderizarFichas();
    }
}

/* =========================================================
   5. GERENCIAMENTO DE FICHAS DE TREINO
========================================================= */

function atualizarCheckboxesFichas() {
    const container = document.getElementById('checkListaExercicios');
    if (!container) return;

    container.innerHTML = '';

    if (exerciciosCadastrados.length === 0) {
        container.innerHTML = '<span class="tamanho08 text-muted uppercase">Cadastre exercícios primeiro para criar fichas.</span>';
        return;
    }

    exerciciosCadastrados.forEach(ex => {
        const item = `
            <div class="col-md-4">
                <div class="form-check">
                    <input class="form-check-input check-exercicio" type="checkbox" value="${ex.id}" id="check_ex_${ex.id}">
                    <label class="form-check-label tamanho08 uppercase" for="check_ex_${ex.id}">
                        ${ex.nomeExercicio} (${ex.pesoAtual}kg)
                    </label>
                </div>
            </div>
        `;
        container.innerHTML += item;
    });
}

function renderizarFichas() {
    const container = document.getElementById('containerFichas');
    if (!container) return;

    container.innerHTML = '';

    if (fichasCadastradas.length === 0) {
        container.innerHTML = '<p class="tamanho08 text-muted text-center py-3 uppercase">Nenhuma ficha criada ainda.</p>';
        return;
    }

    fichasCadastradas.forEach(ficha => {
        const listaExerciciosHtml = ficha.exerciciosIds.map(exId => {
            const ex = exerciciosCadastrados.find(e => e.id === exId);
            if (!ex) return `<li class="list-group-item list-group-item-danger tamanho07 uppercase">Exercício removido</li>`;
            return `<li class="list-group-item d-flex justify-content-between align-items-center tamanho08 uppercase">
                        <span>${ex.nomeExercicio}</span>
                        <span class="badge bg-primary rounded-pill">${ex.series}X${ex.repeticoes} - ${ex.pesoAtual}KG</span>
                    </li>`;
        }).join('');

        const cardHtml = `
            <div class="col-md-6">
                <div class="card h-100 border-primary">
                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <strong class="uppercase">${ficha.nomeFicha}</strong>
                        <span class="badge bg-light text-dark tamanho07 uppercase">${ficha.diaSemana}</span>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush mb-3">
                            ${listaExerciciosHtml.length > 0 ? listaExerciciosHtml : '<li class="list-group-item text-muted tamanho07 uppercase">Sem exercícios vinculados</li>'}
                        </ul>
                    </div>
                    <div class="card-footer text-end bg-white">
                        <button class="btn btn-outline-danger btn-sm font-button uppercase" onclick="excluirFicha('${ficha.id}')">
                            <i class="fa fa-trash me-1"></i> Excluir Ficha
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

function excluirFicha(id) {
    if (confirm('Deseja excluir esta ficha de treino?')) {
        fichasCadastradas = fichasCadastradas.filter(f => f.id !== id);
        salvarFichasStorage();
        renderizarFichas();
    }
}

/* =========================================================
   6. INICIALIZAÇÃO E EVENTOS
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Carregamento inicial de componentes
    populaBtnExerciciosCadastrados();
    renderizarFichas();

    // Evento: Submissão do Formulário de Exercício
    const formExercicio = document.getElementById('formNovoExercicio');
    if (formExercicio) {
        formExercicio.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('inputNome').value.trim();
            const series = document.getElementById('inputSeries').value;
            const repeticoes = document.getElementById('inputRepeticoes').value;
            const pesoAtual = Number(document.getElementById('inputPesoAtual').value);
            let maiorPeso = Number(document.getElementById('inputMaiorPeso').value);
            const dificuldade = document.getElementById('selectDificuldade').value;

            if (pesoAtual > maiorPeso) {
                maiorPeso = pesoAtual;
            }

            const novoExercicio = new ExercicioAcademia(
                gerarIdUnico(),
                dataAtualFormatada(),
                nome,
                series,
                repeticoes,
                pesoAtual,
                maiorPeso,
                dificuldade
            );

            exerciciosCadastrados.push(novoExercicio);
            salvarExerciciosStorage();
            populaBtnExerciciosCadastrados();

            formExercicio.reset();
            alert('Exercício cadastrado com sucesso!');
        });
    }

    // Evento: Submissão do Formulário de Ficha
    const formFicha = document.getElementById('formNovaFicha');
    if (formFicha) {
        formFicha.addEventListener('submit', (e) => {
            e.preventDefault();

            const nomeFicha = document.getElementById('nomeFicha').value.trim();
            const diaSemana = document.getElementById('diaSemana').value;
            
            const checkboxes = document.querySelectorAll('.check-exercicio:checked');
            const exerciciosIds = Array.from(checkboxes).map(cb => cb.value);

            if (exerciciosIds.length === 0) {
                alert('Selecione ao menos um exercício para compor a ficha!');
                return;
            }

            const novaFicha = new FichaTreino(
                gerarIdUnico(),
                nomeFicha,
                diaSemana,
                exerciciosIds
            );

            fichasCadastradas.push(novaFicha);
            salvarFichasStorage();
            renderizarFichas();

            formFicha.reset();
            atualizarCheckboxesFichas();
            alert('Ficha de treino criada com sucesso!');
        });
    }

    // Evento: Filtro de Busca em Tempo Real
    const inputBusca = document.getElementById('inputBusca');
    if (inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            populaBtnExerciciosCadastrados(e.target.value);
        });
    }
});