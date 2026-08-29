/* =========================================================
   CONFIGURAÇÕES
========================================================= */
// [OK] - Chaves do LocalStorage
const STORAGE = {
    exercicios: 'exercicioAcademia',
    idsExercicios: 'idsExercicios',
    fichas: 'fichaExercicio'
};

// [OK] - Categorias de exercícios
const categoriasExercicios = [
    'trapézio',
    'ombro',
    'bíceps',
    'tríceps',
    'peito',
    'costas',
    'abdome',
    'glúteo',
    'pernas',
    'panturrilha',
    'aeróbico'
];

// [OK] - Categorias de Fichas
const treinos = [
    'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O'
];

// [OK] - Arrays de exercícios, ids de Exercicios e fichas cadastradas
let exerciciosCadastrados = JSON.parse(localStorage.getItem(STORAGE.exercicios)) || [];
let idsCadastradosExercicios = JSON.parse(localStorage.getItem(STORAGE.idsExercicios)) || [];
let fichasCadastradas = JSON.parse(localStorage.getItem(STORAGE.fichas)) || [];

let desativado = true;

/* =========================================================
   MODELOS
========================================================= */
// [OK] - Class de Cadastro de Exercicio
class ExercicioAcademia {
    constructor(
        id,
        dataCadastro,
        series,
        repeticoes,
        nomeExercicio,
        maiorPeso,
        pesoAtual,
        dificuldade
    ) {

        this.id = id;
        this.dataCadastro = dataCadastro;
        this.series = series;
        this.repeticoes = repeticoes;
        this.nomeExercicio = nomeExercicio;
        this.maiorPeso = maiorPeso;
        this.pesoAtual = pesoAtual;
        this.dificuldade = dificuldade;
    }
}

// [OK] - Class de Cadastro de Ficha de Exercício
class FichaExercicio {
    constructor(
        idFicha,
        dataCadastro,
        dataInicio,
        statusFicha,
        dataConclusao,
        qtdSubfichas,
        ultimaLetraExercitada,
        treinos
    ) {

        this.idFicha = idFicha;
        this.dataCadastro = dataCadastro;
        this.dataInicio = dataInicio;
        this.statusFicha = statusFicha;
        this.dataConclusao = dataConclusao;
        this.qtdSubfichas = qtdSubfichas;
        this.ultimaLetraExercitada = ultimaLetraExercitada;
        this.treinos = treinos;
    }
}


/* =========================================================
   LOCAL STORAGE
========================================================= */
// [OK] - Salva o Exercício e seu respectivo ID no LocalStorage
function salvarExerciciosStorage() {
    localStorage.setItem(STORAGE.exercicios,JSON.stringify(exerciciosCadastrados));
    localStorage.setItem(STORAGE.idsExercicios,JSON.stringify(idsCadastradosExercicios));
}

// [OK] - Salva as Fichas no LocalStorage
function salvarFichasStorage() {
    localStorage.setItem(STORAGE.fichas,JSON.stringify(fichasCadastradas));
}

/* =========================================================
   DATA
========================================================= */
// [OK] - Exibe a data Atual no ID DEFINIDO na chamada da função
function mostraDataAtual(idCampo) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    campo.value = `${ano}-${mes}-${dia}`;
}

function mostrarDataCorrigida(data, idCampoExibicao) {

    if (!data) {
        console.error('Data não informada:', data);
        return;
    }

    const [ano, mes, dia] = data.split('-');

    const dataCorrigida = `${ano}-${mes}-${dia}`;
    const dataExibicao = `${dia}/${mes}/${ano}`;

    const campo = document.getElementById(idCampoExibicao);

    if (campo) {
        campo.value = dataCorrigida;

        console.log('VALOR DO INPUT:', campo.value);
    }

    console.log('Data recebida:', data);
    console.log('Data corrigida:', dataCorrigida);
    console.log('Data para exibição:', dataExibicao);
}

/* =========================================================
   GERADOR DE ID
========================================================= */
// [OK] Função padrão para gerar IDS
function gerarId(alias, array, inputId) {
    const campo = document.getElementById(inputId); //Localiza o campo de input pelo ID fornecido
    if (!campo) return;
    const numero = array.length + 1; //Gera um número baseado no tamanho do array fornecido, incrementado em 1
    campo.value = `${alias}${String(numero).padStart(2, '0')}`; //Inputa o código gerado no ID localizado
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */
/*window.onload = function () {
    const modalElement =
        document.getElementById('modalTreino');

    const modal =
        new bootstrap.Modal(modalElement);

    modal.show();
    abreModal('Cadastrar Ficha');
    atualizaQtdTreinos(3);
    mostraDataAtual('dataCadastroNovaFicha');
    mostraDataAtual('dataInicioNovaFicha');
};/


/* =========================================================
   MODAL
========================================================= */

// [OK] função para Abrir Modal Especifico
function abreModal(escolha) {
    const tituloModal = document.getElementById('tituloModal');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');

    tituloModal.innerHTML = `
        <h5 class="modal-title uppercase m-auto">
            ${escolha}
        </h5>

        <button
            type="button"
            class="bg-danger btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            id="x-timesCadastro">
        </button>
    `;

    /* =====================================================
       CADASTRO DE EXERCÍCIO
    ===================================================== */

    if (escolha === 'Cadastrar Exercício') {
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-3 mb-2">
                    <label class="labelText flexCenter">ID</label>

                    <input type="text" class="form-control" disabled id="idCadastroNovoExercicio">
                </div>

                <div class="col-auto mb-2">
                    <label class="labelText flexCenter">Data cadastro</label>

                    <input type="date" class="form-control" id="dataCadastroNovoExercicio" disabled>
                </div>

                <div class="col mb-2">
                    <label class="labelText flexCenter">Séries</label>

                    <input
                        type="number" class="form-control" min="1" value="3" id="seriesCadastroNovoExercicio">
                </div>

                <div class="col mb-2">
                    <label class="labelText flexCenter">Repetições</label>

                    <input type="number" class="form-control" min="1" value="12" id="repeticoesCadastroNovoExercicio">
                </div>

                <div class="col-12 mt-2 mb-2">
                    <label class="labelText flexCenter">Nome do exercício</label>

                    <input type="text" class="form-control" placeholder="Digite o nome do exercício..." id="nomeCadastroNovoExercicio">
                </div>

                <div class="col-4 mt-2 mb-2">
                    <label class="labelText flexCenter">Maior Peso</label>

                    <input type="number" class="form-control" min="1" value="1" id="maiorPesoCadastroNovoExercicio">
                </div>

                <div class="col-4 mt-2 mb-2">
                    <label class="labelText flexCenter">Peso Atual</label>

                    <input type="number" class="form-control" min="1" value="1" id="pesoAtualCadastroNovoExercicio">
                </div>


                <div class="col-4 mt-2 mb-2">
                    <label class="labelText flexCenter">Dificuldade</label>

                    <select class="form-select" id="dificuldadeCadastroNovoExercicio">
                        <option value="dificuldadeNulo">-</option>
                        <option value="Fácil">Fácil</option>
                        <option value="Normal">Normal</option>
                        <option value="Difícil">Difícil</option>
                    </select>
                </div>
            </div>
        `;

        modalFooter.innerHTML = `
            <button type="button" class="btn btn-sm btn-success" onclick="salvarCadastroExercicio()">
                <i class="fa fa-save"></i>&nbsp;&nbsp;
                <span class="font-button">Salvar</span>
            </button>
        `;

        gerarId('ex_',idsCadastradosExercicios,'idCadastroNovoExercicio');
        mostraDataAtual('dataCadastroNovoExercicio');
        return;
    }

    /* =====================================================
       CADASTRO DE FICHA
    ===================================================== */
    if (escolha === 'Cadastrar Ficha') {
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-3 mb-4">
                    <label class="labelText flexCenter">ID ficha</label>
                    <input type="text" class="form-control" disabled id="idCadastroNovaFicha">
                </div>

                <div class="col-auto mb-4">
                    <label class="labelText flexCenter">Data cadastro</label>
                    <input type="date" class="form-control" id="dataCadastroNovaFicha" disabled>
                </div>

                <div class="col-auto mb-4">
                    <label class="labelText flexCenter">Data início</label>
                    <input type="date" class="form-control" id="dataInicioNovaFicha">
                </div>

                <div class="col-3 mb-2">
                    <label class="labelText flexCenter">Qtd Treinos</label>
                    <input type="number" class="form-control" min="1" max="15" value="3"
                        onchange="atualizaQtdTreinos(this.value)">
                </div>

                <div class="col mb-2">
                    <label class="labelText flexCenter">&nbsp;</label>
                    <button class="btn btn-sm btn-success" onclick="criarFicha()">
                        <i class="fa fa-check"></i>&nbsp;&nbsp;
                        <span class="font-button">Abrir esta Ficha</span>
                    </button>
                </div>
            </div>
            <hr>
            <div class="row" id="areaDasFichas"></div>
        `;

        gerarId('fch_',fichasCadastradas,'idCadastroNovaFicha');
        return;
    }

    /* =====================================================
       EXERCÍCIOS CADASTRADOS
    ===================================================== */
    if (escolha === 'Meus Exercícios Cadastrados') {
        populaBtnExerciciosCadastrados();
    }

    /* =====================================================
       MINHAS FICHAS DE TREINAMENTO
    ===================================================== */
    if (escolha === 'Minhas Fichas de Treinamento') {
        exibeFichasTreinos();
    }
}

function exibeFichasTreinos() {
    const campoModalBody = document.getElementById('modalBody');
    if (!campoModalBody) return;

    // Limpa o conteúdo anterior
    campoModalBody.innerHTML = '';
   
    for(let i = 0; i < fichasCadastradas.length; i++) {
        campoModalBody.innerHTML += `
            <div class="row mb-3">
                <div class="col">
                    <div class="card" id="cardFicha_${fichasCadastradas[i].idFicha}">
                        <div class="card-header bg-primary text-light">
                            <div class="row">
                                <div class="col">
                                    <span class="uppercase">Ficha ${fichasCadastradas[i].idFicha}</span>
                                </div>
                                <div class="col-auto">
                                    <span class="uppercase">Status: ${fichasCadastradas[i].statusFicha} lelele</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-body" id="cardBodyFicha_${fichasCadastradas[i].idFicha}">
                        
                        </div>
                    </div>
                </div>
            </div>
        `
        for(let j = 0; j < treinos.length; j++) {
            const ficha = fichasCadastradas[i];
            const treino = treinos[j];
        }
    }
}

/* =========================================================
   EXERCÍCIOS
========================================================= */
function salvarCadastroExercicio() {
    const id = document.getElementById('idCadastroNovoExercicio').value;
    const dataCadastro = document.getElementById('dataCadastroNovoExercicio').value;
    const series = document.getElementById('seriesCadastroNovoExercicio').value;
    const repeticoes = document.getElementById('repeticoesCadastroNovoExercicio').value;
    const nome = ocument.getElementById('nomeCadastroNovoExercicio').value.trim();
    const maiorPeso = document.getElementById('maiorPesoCadastroNovoExercicio').value;
    const pesoAtual = document.getElementById('pesoAtualCadastroNovoExercicio').value;
    const dificuldade = document.getElementById('dificuldadeCadastroNovoExercicio').value;

    if (!nome) {
        alert('Insira o nome do exercício!');
        return;
    }

    const existe = exerciciosCadastrados.some(exercicio => 
        exercicio.nomeExercicio.toLowerCase() === nome.toLowerCase()
        );

    if (existe) {
        alert('Este exercício já está cadastrado.');
        return;
    }

    const exercicio =
        new ExercicioAcademia(
            id,
            dataCadastro,
            series,
            repeticoes,
            nome,
            maiorPeso,
            pesoAtual,
            dificuldade
        );

    exerciciosCadastrados.push(exercicio);
    idsCadastradosExercicios.push(id);
    salvarExerciciosStorage();
    alert(`Exercício "${nome}" cadastrado com sucesso!`);

    if (confirm('Deseja cadastrar outro exercício?')) {
        limparCamposExercicio();
    } else {
        document.getElementById('x-timesCadastro').click();
    }
}

/* =========================================================
   LIMPAR CAMPOS
========================================================= */
function limparCamposExercicio() {
    document.getElementById('seriesCadastroNovoExercicio').value = 3;
    document.getElementById('repeticoesCadastroNovoExercicio').value = 12;
    document.getElementById('nomeCadastroNovoExercicio').value = '';
    document.getElementById('maiorPesoCadastroNovoExercicio').value = 1;
    document.getElementById('pesoAtualCadastroNovoExercicio').value = 1;
    document.getElementById('dificuldadeCadastroNovoExercicio').value = 'dificuldadeNulo';

    gerarId('ex_',idsCadastradosExercicios,'idCadastroNovoExercicio');
}

/* =========================================================
   CATEGORIAS
========================================================= */

function populaCategoriasExercicios(idArea,tipoTreino) {
    const area = document.getElementById(idArea);

    if (!area) return;

    const categorias = [...categoriasExercicios].sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
    );

    area.innerHTML = '';

    categorias.forEach(categoria => {
        const idCheckbox =
            `checkbox_${tipoTreino}_${categoria}`;

        area.innerHTML += `
            <div class="col-4 mb-1">
                <input
                    type="checkbox"
                    class="checkboxCategoria"
                    data-treino="${tipoTreino}"
                    value="${categoria}"
                    id="${idCheckbox}"
                    onchange="atualizarCategoriasTreino('${tipoTreino}')">

                <label for="${idCheckbox}" class="uppercase tamanho08">${categoria}</label>
            </div>
        `;
    });
}

/* =========================================================
   ATUALIZA CATEGORIAS DO TREINO
========================================================= */
function atualizarCategoriasTreino(tipoTreino) {
    const checkboxes = document.querySelectorAll(`.checkboxCategoria[data-treino="${tipoTreino}"]`);

    const categoriasSelecionadas = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            categoriasSelecionadas.push(checkbox.value);
        }
    });

    const fichaAtual = obterFichaEmEdicao();

    if (!fichaAtual) return;
    
    fichaAtual.treinos[tipoTreino].categorias = categoriasSelecionadas;

    salvarFichasStorage();
    exibirCategoriasSelecionadas(tipoTreino,categoriasSelecionadas);
}

/* =========================================================
   EXIBE CATEGORIAS SELECIONADAS
========================================================= */

function exibirCategoriasSelecionadas(tipoTreino,categorias) {
    const area =document.getElementById(`mostruarioCategorias_${tipoTreino}`);

    if (!area) return;

    area.innerHTML = categorias.map(categoria => `
            <span class="badge rounded-pill bg-success me-1 mb-1">${categoria}</span>
        `).join('');
}

/* =========================================================
   QUANTIDADE DE TREINOS
========================================================= */

function atualizaQtdTreinos(qtd) {
    qtd = Number(qtd);
    const area =document.getElementById('areaDasFichas');
    if (!area) return;
    area.innerHTML = '';
    for (let i = 0; i < qtd; i++) {
        const treino = treinos[i]; 

        area.innerHTML += `
            <div class="row">
                <div class="col mb-3">
                    <div class="card">
                        <div  class="card-header uppercase textoCenter bg-dark text-light"
                            type="button"
                            id="header_${treino}"
                            data-bs-toggle="collapse"
                            data-bs-target="#cardBodyTreino${treino}"
                            onclick=" mudaChevronExerciciosCadastrados('chevronTreino${treino}','header_${treino}');
                            populaCategoriasExercicios('areasTreinoFicha${treino}','${treino}');">

                            <div class="row">
                                <div class="col">
                                    <span class="flexCenter">Treino ${treino}</span>
                                </div>
                                <div class="col-1">
                                    <i class="fa fa-chevron-down" id="chevronTreino${treino}"></i>
                                </div>
                            </div>
                        </div>

                        <div class="card-body collapse" id="cardBodyTreino${treino}" >
                            <!-- CATEGORIAS -->

                            <div class="row" id="areasTreinoFicha${treino}"></div>
                            <div class="row mt-2" id="mostruarioCategorias_${treino}"></div>
                            <hr>

                            <!-- ADICIONAR EXERCÍCIO -->
                            <div class="row">
                                <div class="col">
                                    <button class="btn btn-sm btn-primary font-button w-100" 
                                    onclick=" adicionaExerciciosFicha(
                                                'campoInsereSelect_Treino${treino}',
                                                '${treino}')">

                                        <i class="fa fa-circle-plus"></i>&nbsp;&nbsp;
                                        <span>Adicionar exercício</span>
                                    </button>
                                </div>
                            </div>

                            <div class="row my-3" id="campoInsereSelect_Treino${treino}"></div>
                            <hr>

                            <!-- EXERCÍCIOS INSERIDOS -->
                            <div class="row" id="mostruarioExerciciosInseridos_${treino}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}


/* =========================================================
   FICHA EM EDIÇÃO
========================================================= */
function obterFichaEmEdicao() {
    const id =document.getElementById('idCadastroNovaFicha')?.value;
    if (!id) return null;

    return fichasCadastradas.find(ficha => ficha.idFicha === id);
}


/* =========================================================
   CRIAR FICHA TEMPORÁRIA
========================================================= */
function criarEstruturaFicha(qtdTreinos) {
    const treinosFicha = {};

    for (let i = 0;i < qtdTreinos;i++) {
        const letra = treinos[i];
        treinosFicha[letra] = { categorias: [], exercicios: []};
    }

    return treinosFicha;
}


/* =========================================================
   CRIAR FICHA
========================================================= */
function criarFicha() {
    const idFicha = document.getElementById('idCadastroNovaFicha').value;
    const dataCadastro = document.getElementById('dataCadastroNovaFicha').value;
    const dataInicio = document.getElementById('dataInicioNovaFicha').value;


    const qtdTreinos = Number(document.querySelector('#modalBody input[type="number"]').value);
    const fichaExistente = fichasCadastradas.find(ficha =>ficha.idFicha === idFicha);

    if (fichaExistente) {
        alert('Esta ficha já existe.');

        return;
    }

    const novaFicha =
        new FichaExercicio(
            idFicha,
            dataCadastro,
            dataInicio,
            'Ativa',
            '',
            qtdTreinos,
            'A',
            criarEstruturaFicha(qtdTreinos)
        );

    fichasCadastradas.push(novaFicha);
    salvarFichasStorage();

    console.log('Ficha criada:', novaFicha);

    alert(`Ficha ${idFicha} criada com sucesso!`);
}


/* =========================================================
   ADICIONAR EXERCÍCIO
========================================================= */

function adicionaExerciciosFicha(idSelect,tipoTreino) {
    const campo =document.getElementById(idSelect);

    if (!campo) return;

    campo.innerHTML = `
        <div class="row mb-2">
            <div class="col input-group">
                <select class="form-select" id="selectExercicio_${tipoTreino}">
                    <option value="">Selecione um exercício</option>
                </select>

                <button class="btn btn-success" onclick="confirmaExercicioFicha('${tipoTreino}')">
                    <i class="fa fa-check"></i>
                </button>
            </div>
        </div>
    `;

    const select = document.getElementById(`selectExercicio_${tipoTreino}`);

    exerciciosCadastrados.forEach(exercicio => {
            select.innerHTML += `
                <option value="${exercicio.id}">
                    ${exercicio.nomeExercicio}
                </option>
            `;
        }
    );
}


/* =========================================================
   CONFIRMAR EXERCÍCIO
========================================================= */
function confirmaExercicioFicha(
    tipoTreino) {
    const select = document.getElementById(`selectExercicio_${tipoTreino}`);

    if (!select || !select.value) {
        alert('Selecione um exercício.');
        return;
    }

    const idExercicio = select.value;
    const exercicio = exerciciosCadastrados.find(exercicio =>exercicio.id === idExercicio);

    if (!exercicio) return;

    const ficha = obterFichaEmEdicao();

    if (!ficha) {
        alert('A ficha ainda não foi criada.');
        return;
    }

    const treino = ficha.treinos[tipoTreino];
    const jaExiste = treino.exercicios.some(exercicio =>exercicio.id === idExercicio);

    if (jaExiste) {
        alert('Este exercício já está neste treino.');
        return;
    }


    treino.exercicios.push({id: exercicio.id, nome: exercicio.nomeExercicio});
    salvarFichasStorage();
    renderizarExerciciosTreino(tipoTreino);
}


/* =========================================================
   RENDERIZAR EXERCÍCIOS DO TREINO
========================================================= */

function renderizarExerciciosTreino(tipoTreino) {
    const ficha = obterFichaEmEdicao();
    if (!ficha) return;

    const area = document.getElementById(`mostruarioExerciciosInseridos_${tipoTreino}`);
    if (!area) return;

    const exercicios = ficha.treinos[tipoTreino].exercicios;
    area.innerHTML = '';

    exercicios.forEach(
        exercicio => {
            area.innerHTML += `
                <div class="col-12 mb-2">
                    <span class="badge rounded-pill bg-success py-2 w-100 uppercase">
                        <i class="fa-solid fa-dumbbell"></i>&nbsp;&nbsp;
                        ${exercicio.nome}
                    </span>
                </div>
            `;
        }
    );
}


/* =========================================================
   CHEVRON
========================================================= */

function mudaChevronExerciciosCadastrados(
    idIcone,
    idHeader
) {

    const icone =
        document.getElementById(
            idIcone
        );

    const header =
        document.getElementById(
            idHeader
        );


    if (!icone || !header) return;


    if (
        icone.classList.contains(
            'fa-chevron-down'
        )
    ) {

        icone.classList.replace(
            'fa-chevron-down',
            'fa-chevron-up'
        );

        header.classList.replace(
            'bg-dark',
            'bg-danger'
        );

    } else {

        icone.classList.replace(
            'fa-chevron-up',
            'fa-chevron-down'
        );

        header.classList.replace(
            'bg-danger',
            'bg-dark'
        );
    }
}


/* =========================================================
   EXIBIR EXERCÍCIOS CADASTRADOS
========================================================= */

function populaBtnExerciciosCadastrados() {

    const area =
        document.getElementById(
            'modalBody'
        );


    area.innerHTML = '';


    exerciciosCadastrados.forEach(
        exercicio => {

            area.innerHTML += `

                <div class="row mb-3">

                    <div class="col">

                        <div class="card">

                            <div
                                class="card-header bg-primary text-light"

                                type="button"

                                id="headerExercicio_${exercicio.id}"

                                data-bs-toggle="collapse"

                                data-bs-target="#exercicio_${exercicio.id}_Descricao"

                                onclick="
                                    mudaChevronExerciciosCadastrados(
                                        'icone_${exercicio.id}',
                                        'headerExercicio_${exercicio.id}'
                                    )
                                "
                            >

                                <div class="row">

                                    <div class="col">

                                        <i class="fa-solid fa-dumbbell"></i>

                                        &nbsp;&nbsp;

                                        <span class="uppercase">

                                            ${exercicio.nomeExercicio}

                                        </span>

                                    </div>

                                    <div class="col-auto">

                                        <i
                                            class="fa fa-chevron-down"
                                            id="icone_${exercicio.id}">
                                        </i>

                                    </div>

                                </div>

                            </div>


                            <div
                                class="collapse"
                                id="exercicio_${exercicio.id}_Descricao">

                                <div class="card-body">

                                    ${gerarCamposEdicaoExercicio(
                                        exercicio
                                    )}

                                </div>

                                <div class="card-footer">

                                    <button
                                        class="btn btn-sm btn-primary"
                                        onclick="
                                            editaCadastroFinalExercicio(
                                                '${exercicio.id}'
                                            )
                                        "
                                    >

                                        <i class="fa fa-edit"></i>

                                        Editar

                                    </button>

                                    <button
                                        class="btn btn-sm btn-success"
                                        onclick="
                                            salvaCadastroFinalExercicio(
                                                '${exercicio.id}'
                                            )
                                        "
                                    >

                                        <i class="fa fa-save"></i>

                                        Salvar

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            `;

        }
    );
}


/* =========================================================
   CAMPOS DE EDIÇÃO
========================================================= */

function gerarCamposEdicaoExercicio(
    exercicio
) {

    return `

        <div class="row">

            <div class="col-3 mb-2">

                <label class="labelText">
                    ID
                </label>

                <input
                    class="form-control"
                    value="${exercicio.id}"
                    disabled>

            </div>


            <div class="col-auto mb-2">

                <label class="labelText">
                    Data cadastro
                </label>

                <input
                    type="date"
                    class="form-control"
                    value="${exercicio.dataCadastro}"
                    disabled>

            </div>


            <div class="col-2 mb-2">

                <label class="labelText">
                    Séries
                </label>

                <input
                    class="form-control"
                    id="series_${exercicio.id}"
                    value="${exercicio.series}"
                    disabled>

            </div>


            <div class="col-2 mb-2">

                <label class="labelText">
                    Repetições
                </label>

                <input
                    class="form-control"
                    id="repeticoes_${exercicio.id}"
                    value="${exercicio.repeticoes}"
                    disabled>

            </div>


            <div class="col-12 mb-2">

                <label class="labelText">
                    Nome
                </label>

                <input
                    class="form-control"
                    id="nome_${exercicio.id}"
                    value="${exercicio.nomeExercicio}"
                    disabled>

            </div>


            <div class="col mb-2">

                <label class="labelText">
                    Maior peso
                </label>

                <input
                    class="form-control"
                    id="maiorPeso_${exercicio.id}"
                    value="${exercicio.maiorPeso}"
                    disabled>

            </div>


            <div class="col mb-2">

                <label class="labelText">
                    Peso atual
                </label>

                <input
                    class="form-control"
                    id="pesoAtual_${exercicio.id}"
                    value="${exercicio.pesoAtual}"
                    disabled>

            </div>


            <div class="col mb-2">

                <label class="labelText">
                    Dificuldade
                </label>

                <select
                    class="form-select"
                    id="dificuldade_${exercicio.id}"
                    disabled>

                    <option>
                        ${exercicio.dificuldade}
                    </option>

                    <option value="Fácil">
                        Fácil
                    </option>

                    <option value="Normal">
                        Normal
                    </option>

                    <option value="Difícil">
                        Difícil
                    </option>

                </select>

            </div>

        </div>

    `;
}


/* =========================================================
   EDITAR EXERCÍCIO
========================================================= */

function editaCadastroFinalExercicio(id) {

    const campos = [

        `series_${id}`,

        `repeticoes_${id}`,

        `nome_${id}`,

        `maiorPeso_${id}`,

        `pesoAtual_${id}`,

        `dificuldade_${id}`

    ];


    campos.forEach(
        campo => {

            const elemento =
                document.getElementById(
                    campo
                );

            if (elemento) {

                elemento.disabled = false;

            }

        }
    );
}


/* =========================================================
   SALVAR EDIÇÃO DO EXERCÍCIO
========================================================= */

function salvaCadastroFinalExercicio(
    id
) {

    const exercicio =
        exerciciosCadastrados.find(
            exercicio =>
                exercicio.id === id
        );


    if (!exercicio) {

        alert(
            'Exercício não encontrado.'
        );

        return;
    }


    if (
        !confirm(
            `Salvar alterações de "${exercicio.nomeExercicio}"?`
        )
    ) {

        return;
    }


    exercicio.series =
        document.getElementById(
            `series_${id}`
        ).value;


    exercicio.repeticoes =
        document.getElementById(
            `repeticoes_${id}`
        ).value;


    exercicio.nomeExercicio =
        document.getElementById(
            `nome_${id}`
        ).value.trim();


    exercicio.maiorPeso =
        document.getElementById(
            `maiorPeso_${id}`
        ).value;


    exercicio.pesoAtual =
        document.getElementById(
            `pesoAtual_${id}`
        ).value;


    exercicio.dificuldade =
        document.getElementById(
            `dificuldade_${id}`
        ).value;


    salvarExerciciosStorage();


    alert(
        'Exercício atualizado com sucesso!'
    );


    populaBtnExerciciosCadastrados();
}

