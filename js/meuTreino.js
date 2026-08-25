function mostraDataAtual(idCampo) {
    const campoData = document.getElementById(idCampo);
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    campoData.value = `${ano}-${mes}-${dia}`;
}

let desativado = true;
//true : disabled: true;
//false: disabled: false;

window.onload = function () {
    const modal = document.getElementById('modalTreino');
    const meuModal = new bootstrap.Modal(modal);
    meuModal.show();
    abreModal('Cadastrar Ficha');
    atualizaQtdTreinos(3),
    mostraDataAtual('dataCadastroNovaFicha');
    mostraDataAtual('dataInicioNovaFicha');
};

let categoriasExercicios = [
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
    'aeróbico',
]

let treinos = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O']

let idsCadastradosExercicios = JSON.parse(localStorage.getItem("idsExercicios")) || []
let exerciciosCadastrados = JSON.parse(localStorage.getItem("exercicioAcademia")) || [];
let fichasCadastradas = JSON.parse(localStorage.getItem("fichaExercicio")) || [];

// [function OK]
class ExercicioAcademia {
    constructor(
        id,
        dataCadastro,
        series,
        repeticoes,
        nomeExercicio,
        maiorPeso,
        pesoAtual,
        dificuldade) {

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

class FichaExercicio {
    constructor(
        idFicha,
        dataCadastro,
        dataInicio,
        statusFicha,
        dataConclusao,
        qtdSubfichas,
        ultimaLetraExercitada,
        categoriasExercicios,
        ExerciciosPrescritos
    ){
        this.idFicha = idFicha;    
        this.dataCadastro = dataCadastro;    
        this.dataInicio = dataInicio;    
        this.statusFicha = statusFicha;    
        this.dataConclusao = dataConclusao;    
        this.qtdSubfichas = qtdSubfichas;    
        this.ultimaLetraExercitada = ultimaLetraExercitada;    
        this.categoriasExercicios = categoriasExercicios;    
        this.ExerciciosPrescritos = ExerciciosPrescritos;    
    }
}

// [function OK]
function gerarId(aliasCodigo, nomeArray, inputID) {
    const campoId = document.getElementById(inputID);
    const numero = nomeArray.length + 1;
    campoId.value = aliasCodigo + String(numero).padStart(2, '0');
}

// [function OK]
function salvarCadastro(tipo) {
    const idExercicio = document.getElementById('idCadastroNovoExercicio').value;
    const dataCadastro = document.getElementById('dataCadastroNovoExercicio').value;
    const seriesExercicio = document.getElementById('seriesCadastroNovoExercicio').value;
    const repeticoesExercicio = document.getElementById('repeticoesCadastroNovoExercicio').value;
    const nomeExercicio = document.getElementById('nomeCadastroNovoExercicio').value;
    const maiorPesoExercicio = document.getElementById('maiorPesoCadastroNovoExercicio').value;
    const pesoAtualExercicio = document.getElementById('pesoAtualCadastroNovoExercicio').value;
    const dificuldadeExercicio = document.getElementById('dificuldadeCadastroNovoExercicio').value;

    if (tipo === 'exercicio') {
        if (nomeExercicio.trim() === '') {
            alert('Insira o nome do Exercício e tente novamente!');
            return;
        }

        const exercicioExiste = exerciciosCadastrados.some(exercicio =>
            exercicio.nomeExercicio === nomeExercicio.trim()
        );

        if (exercicioExiste) {
            alert('O exercício já foi inserido anteriormente. Tente outro valor.');
            return;
        }

        const novoExercicio = new ExercicioAcademia(
            idExercicio,
            dataCadastro,
            seriesExercicio,
            repeticoesExercicio,
            nomeExercicio.trim(),
            maiorPesoExercicio,
            pesoAtualExercicio,
            dificuldadeExercicio
        );

        exerciciosCadastrados.push(novoExercicio);
        idsCadastradosExercicios.push(idExercicio);

        localStorage.setItem('exercicioAcademia', JSON.stringify(exerciciosCadastrados));
        localStorage.setItem('idsExercicios', JSON.stringify(idsCadastradosExercicios));


        alert(`Exercício ${nomeExercicio} cadastrado com sucesso!`);
        let confirmacaoNovoCadastro = confirm('Deseja fazer um novo cadastro ?');

        if (confirmacaoNovoCadastro) {
            limparCampos('exercicio')
        }
        else {
            document.getElementById('x-timesCadastro').click();
        }
    }
}

// [function OK]
function limparCampos(tipo) {
    let seriesExercicio = document.getElementById('seriesCadastroNovoExercicio').value;
    let repeticoesExercicio = document.getElementById('repeticoesCadastroNovoExercicio').value;
    let nomeExercicio = document.getElementById('nomeCadastroNovoExercicio').value;
    let maiorPesoExercicio = document.getElementById('maiorPesoCadastroNovoExercicio').value;
    let pesoAtualExercicio = document.getElementById('pesoAtualCadastroNovoExercicio').value;
    let dificuldadeExercicio = document.getElementById('dificuldadeCadastroNovoExercicio').value;

    if (tipo === 'exercicio') {
        seriesExercicio = '3';
        repeticoesExercicio = '12';
        nomeExercicio = '';
        maiorPesoExercicio = '1';
        pesoAtualExercicio = '1';
        dificuldadeExercicio = 'dificuldadeNulo';

        gerarId('ex_', idsCadastradosExercicios, 'idCadastroNovoExercicio')
    }
}

// [function OK]
function populaCategoriasExercicios(id) {
    const campoExibicao = document.getElementById(id);
    campoExibicao.innerHTML = '';
    const categoriasOrdenadas = [...categoriasExercicios].sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
    );
    for (let i = 0; i < categoriasOrdenadas.length; i++) {
        campoExibicao.innerHTML += `
            <div class="col-4 mb-1">
                <input type="checkbox" name="" id="checkbox_${categoriasOrdenadas[i]}">&nbsp;
                <span class="uppercase tamanho08">
                    ${categoriasOrdenadas[i]}
                </span>
            </div>
        `;
    }
}

// [function OK]
function abreModal(escolha) {
    const tituloModal = document.getElementById('tituloModal');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');

    /*--------------------------EXERCICIOS-----------------------------------*/
    let mensagemCadastroExercicio = `
        <div class="row">
            <div class="col-3 mb-2">
                <label for="" class="labelText flexCenter">id</label>
                <input type="text" class="form-control" disabled 
                id="idCadastroNovoExercicio">
            </div>
            <div class="col-auto mb-2">
                <label for="" class="labelText flexCenter">data cadastro</label>
                <input type="date" class="form-control" id="dataCadastroNovoExercicio" 
                disabled>
            </div>
            <div class="col mb-2">
                <label for="" class="labelText flexCenter">séries</label>
                <input type="number" class="form-control" min="1" value="3" 
                id="seriesCadastroNovoExercicio">
            </div>
            <div class="col mb-2">
                <label for="" class="labelText flexCenter">Repetições</label>
                <input type="number" class="form-control" min="1" value="12" 
                id="repeticoesCadastroNovoExercicio">
            </div>
            <div class="col-12 mt-2 mb-2">
                <label for="" class="labelText flexCenter">nome do exercício</label>
                <input type="text" class="form-control" 
                placeholder="digite o nome do exercício..." 
                id="nomeCadastroNovoExercicio">
            </div>
            <div class="col-4 mt-2 mb-2">
                <label for="" class="labelText flexCenter">Maior Peso</label>
                <input type="number" class="form-control" min="1" value="1" 
                id="maiorPesoCadastroNovoExercicio">
            </div>
            <div class="col-4 mt-2 mb-2">
                <label for="" class="labelText flexCenter">Peso Atual</label>
                <input type="number" class="form-control" min="1" value="1"
                id="pesoAtualCadastroNovoExercicio">
            </div>
            <div class="col-4 mt-2 mb-2">
                <label for="" class="labelText flexCenter">Dificuldade</label>
                <select class="form-select" 
                id="dificuldadeCadastroNovoExercicio">
                    <option value="dificuldadeNulo">-</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Normal">Normal</option>
                    <option value="Difícil">Difícil</option">
                </select>
            </div>
        </div>
    `
    let buttonsExercicio = `
        <button type="button" class="btn btn-sm btn-success"
            onclick="salvarCadastro('exercicio')">
                <i class="fa fa-save">&nbsp;&nbsp;</i>
                <span class="font-button">Salvar</span>
            </button>
            <button type="button" class="btn btn-sm btn-primary">
                <i class="fa fa-edit">&nbsp;&nbsp;</i>
                <span class="font-button">Editar</span>
            </button>
            <button type="button" class="btn btn-sm btn-danger">
                <i class="fa fa-trash">&nbsp;&nbsp;</i>
                <span class="font-button">excluir</span>
        </button>
    `
    /*---------------------------NOVA FICHA------------------------------------*/
    let mensagemCadastroFicha = `
        <div class="row">
            <div class="col-3 mb-4">
                <label for="" class="labelText flexCenter">id ficha</label>
                <input type="text" class="form-control" disabled id="idCadastroNovaFicha">
            </div>
            <div class="col-auto mb-4">
                <label for="" class="labelText flexCenter">data cadastro</label>
                <input type="date" class="form-control" id="dataCadastroNovaFicha" 
                disabled>
            </div>
            <div class="col-auto mb-4">
                <label for="" class="labelText flexCenter">data inicio</label>
                <input type="date" class="form-control" id="dataInicioNovaFicha">
            </div>
            <div class="col-4 mb-2">
                <label for="" class="labelText flexCenter">Qtd Treinos</label>
                <input type="number" class="form-control" min="1" value="3"
                onchange="atualizaQtdTreinos(this.value)">
            </div>
            <div class="col mb-2">
                <label for="" class="labelText flexCenter">&nbsp;</label>
                <button class="btn btn-sm btn-success">
                    <i class="fa fa-check"></i>&nbsp;&nbsp;
                    <span class="font-button">concluir ficha</span>
                </button>
            </div>
        </div>
        <hr>
        <div class="row" id="areaDasFichas">
            
        </div>
    `

    /*--------------------EXIBE EXERCICIOS CADASTRADOS--------------------------*/

    tituloModal.innerHTML = `
        <h5 class="modal-title uppercase m-auto" id="tituloModal">
            ${escolha}
        </h5>
        <button type="button" class="bg-danger btn-close" 
        data-bs-dismiss="modal" aria-label="Close"
        id ="x-timesCadastro"></button>
    `

    if (escolha === 'Cadastrar Exercício') {
        modalBody.innerHTML = mensagemCadastroExercicio;
        modalFooter.innerHTML = buttonsExercicio;

        gerarId('ex_', idsCadastradosExercicios, 'idCadastroNovoExercicio');
        mostraDataAtual('dataCadastroNovoExercicio');
    }
    if (escolha === 'Cadastrar Ficha') {
        modalBody.innerHTML = mensagemCadastroFicha;
        gerarId('fch_', fichasCadastradas, 'idCadastroNovaFicha');
    }
    if (escolha === 'Meus Exercicios Cadastrados') {
        populaBtnExerciciosCadastrados()
    }
}

function atualizaQtdTreinos(qtd){
    let areaFichas = document.getElementById('areaDasFichas');
    areaFichas.innerHTML = '';

    for(let i=0;i<qtd;i++){
        areaFichas.innerHTML += `
            <div class="row">
                <div class="col mb-3">
                    <div class="card">
                        <div class="card-header uppercase textoCenter bg-dark text-light" 
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#cardBodyTreino${treinos[i]}"
                        onclick="mudaChevronExerciciosCadastrados('chevronTreino${treinos[i]}'),
                        populaCategoriasExercicios('areasTreinoFicha${treinos[i]}')">
                            <div class="row">
                                <div class="col">
                                    <span class="flexCenter">Treino ${treinos[i]}</span>
                                </div>    
                                <div class="col-1">
                                    <i class="fa fa-chevron-down" id="chevronTreino${treinos[i]}"></i>
                                </div>
                            </div>    
                        </div>

                        <div class="card-body collapse" id="cardBodyTreino${treinos[i]}">
                            <div class="row" id="areasTreinoFicha${treinos[i]}"></div>
                            <hr>
                            <div class="row">
                                <div class="col flexCenter">
                                    <button class="btn btn-sm btn-danger font-button">
                                        <span class="tamanho08">Limpar Categorias</span>&nbsp;&nbsp;
                                        <i class="fa fa-fade fa-arrow-up"></i>
                                    </button>
                                </div>
                                <div class="col flexCenter">
                                    <button class="btn btn-sm btn-primary font-button">
                                        <i class="fa fa-circle-plus"></i>&nbsp&nbsp;
                                        <span class="tamanho08">ADc. exercício</span>
                                    </button>
                                </div>
                            </div>
                            <hr>
                            <div class="row">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// [function OK]
function populaBtnExerciciosCadastrados() {
    const campoExibicao = document.getElementById('modalBody')
    campoExibicao.innerHTML = '';
    for (let i = 0; i < exerciciosCadastrados.length; i++) {
        campoExibicao.innerHTML += `
            <div class="row mb-3">
                <div class="col-12">
                    <div class="card ">
                        <div class="card-header w-100 bg-primary text-light flexCenter" 
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#exercicio_${exerciciosCadastrados[i].id}_Descricao"
                            onclick="mudaChevronExerciciosCadastrados('icone_${exerciciosCadastrados[i].id}')">
                            <div class="col">
                                <i class="fa-solid fa-dumbbell"></i>&nbsp;&nbsp;
                                <span class="uppercase">
                                    ${exerciciosCadastrados[i].nomeExercicio}
                                </span>
                            </div>
                            <i class="fa fa-chevron-down" 
                            id="icone_${exerciciosCadastrados[i].id}"></i>
                        </div>

                        <div class="collapse" id="exercicio_${exerciciosCadastrados[i].id}_Descricao">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-3 mb-2">
                                        <label class="labelText">id exercicio</label>
                                        <input class="form-control" 
                                        value="${exerciciosCadastrados[i].id}" disabled>
                                    </div>
                                    <div class="col-auto mb-2">
                                        <label class="labelText">Data Cadastro</label>
                                        <input type="date" 
                                        class="form-control" 
                                        value="${exerciciosCadastrados[i].dataCadastro}" disabled>
                                    </div>
                                    <div class="col-2 mb-2">
                                        <label class="labelText">Séries</label>
                                        <input type="text"
                                        id="seriesExibeExercicio_${exerciciosCadastrados[i].id}" 
                                        class="form-control" 
                                        value="${exerciciosCadastrados[i].series}" disabled>
                                    </div>
                                    <div class="col-2 mb-2">
                                        <label class="labelText">Repetições</label>
                                        <input type="text"
                                        id="repeticoesExibeExercicio_${exerciciosCadastrados[i].id}"  
                                        class="form-control" 
                                        value="${exerciciosCadastrados[i].repeticoes}" disabled>
                                    </div>
                                    <div class="col-12 mb-2 mt-2">
                                        <label class="labelText">Nome do exercicio</label>
                                        <input class="form-control"
                                        id="nomeExibeExercicio_${exerciciosCadastrados[i].id}"  
                                        value="${exerciciosCadastrados[i].nomeExercicio}" disabled>
                                    </div>
                                    <div class="col mb-2 mt-2">
                                        <label class="labelText">Maior Peso</label>
                                        <input class="form-control"
                                        id="maiorPesoExibeExercicio_${exerciciosCadastrados[i].id}"  
                                        value="${exerciciosCadastrados[i].maiorPeso}" disabled>
                                    </div>
                                    <div class="col mb-2 mt-2">
                                        <label class="labelText">Peso Atual</label>
                                        <input class="form-control"
                                        id="pesoAtualExibeExercicio_${exerciciosCadastrados[i].id}" 
                                        value="${exerciciosCadastrados[i].pesoAtual}" disabled>
                                    </div>
                                    <div class="col mb-2 mt-2">
                                        <label class="labelText">Dificuldade</label>
                                        <select class="form-select"
                                        id="dificuldadeExibeExercicio_${exerciciosCadastrados[i].id}" disabled>
                                            <option value="${exerciciosCadastrados[i].dificuldade}">
                                                ${exerciciosCadastrados[i].dificuldade} 
                                            </option>
                                            <option value="Fácil">Fácil</option>
                                            <option value="Normal">Normal</option>
                                            <option value="Difícil">Difícil</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col flexCenter gap-2">
                                        <button class="btn btn-sm btn-primary d-block"
                                        id='btnEditarExercicioCadastrado_${exerciciosCadastrados[i].id}'
                                        onclick="editaCadastroFinalExercicio('${exerciciosCadastrados[i].id}')">
                                            <i class="fa fa-edit"></i>&nbsp;&nbsp;
                                            <span class="font-button textoCenter">editar</span>
                                        </button>
                                        <button class="btn btn-sm btn-success d-none"
                                        id='btnSalvarExercicioCadastrado_${exerciciosCadastrados[i].id}'
                                        onclick="salvaCadastroFinalExercicio('${exerciciosCadastrados[i].id}')">
                                            <i class="fa fa-save"></i>&nbsp;&nbsp;
                                            <span class="font-button textoCenter">Salvar</span>
                                        </button>
                                        <button class="btn btn-sm btn-danger"
                                        id='btnExcluirExercicioCadastrado_${exerciciosCadastrados[i].id}'>
                                            <i class="fa fa-trash"></i>&nbsp;&nbsp;
                                            <span class="font-button textoCenter">Excluir</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>              
                    </div>
                </div>
            </div>
        `
    }

}

// [function OK]
function mudaChevronExerciciosCadastrados(aliasId) {
    const icone = document.getElementById(aliasId);
    if (icone.classList.contains('fa-chevron-down')) {
        icone.classList.replace(
            'fa-chevron-down',
            'fa-chevron-up'
        );
    } else {
        icone.classList.replace(
            'fa-chevron-up',
            'fa-chevron-down'
        );
    }
}

// [function OK]
function editaCadastroFinalExercicio(id) {
    const campos = [
        `seriesExibeExercicio_${id}`,
        `repeticoesExibeExercicio_${id}`,
        `nomeExibeExercicio_${id}`,
        `maiorPesoExibeExercicio_${id}`,
        `pesoAtualExibeExercicio_${id}`,
        `dificuldadeExibeExercicio_${id}`
    ];

    if (desativado) {
        campos.forEach(idCampo => {
            document.getElementById(idCampo).disabled = false; //campos ativam
        });

        document.getElementById(`btnEditarExercicioCadastrado_${id}`).classList.replace('d-block','d-none');
        document.getElementById(`btnSalvarExercicioCadastrado_${id}`).classList.replace('d-none','d-block');
        desativado = false;

    } else {
        campos.forEach(idCampo => {
            document.getElementById(idCampo).disabled = true;
        });
    }
}

// [function OK]
function salvaCadastroFinalExercicio(id) {

    const campos = [
        `seriesExibeExercicio_${id}`,
        `repeticoesExibeExercicio_${id}`,
        `nomeExibeExercicio_${id}`,
        `maiorPesoExibeExercicio_${id}`,
        `pesoAtualExibeExercicio_${id}`,
        `dificuldadeExibeExercicio_${id}`
    ];

    // Localiza o objeto pelo ID
    const exercicio = exerciciosCadastrados.find(
        exercicio => exercicio.id === id
    );

    // Se não encontrou o exercício
    if (!exercicio) {
        alert('Exercício não encontrado.');
        return;
    }

    // Confirma antes de alterar
    const confirmar = confirm(
        `Deseja realmente salvar as alterações do exercício "${exercicio.nomeExercicio}"?`
    );

    // Se clicou em Cancelar
    if (!confirmar) {
        return;
    }

    // Atualiza o objeto existente
    exercicio.series =
        document.getElementById(campos[0]).value;

    exercicio.repeticoes =
        document.getElementById(campos[1]).value;

    exercicio.nomeExercicio =
        document.getElementById(campos[2]).value.trim();

    exercicio.maiorPeso =
        document.getElementById(campos[3]).value;

    exercicio.pesoAtual =
        document.getElementById(campos[4]).value;

    exercicio.dificuldade =
        document.getElementById(campos[5]).value;

    // Salva o array atualizado no LocalStorage
    localStorage.setItem(
        'exercicioAcademia',
        JSON.stringify(exerciciosCadastrados)
    );

    // Desativa os campos novamente
    campos.forEach(idCampo => {
        document.getElementById(idCampo).disabled = true;
    });

    // Troca os botões
    document
        .getElementById(`btnEditarExercicioCadastrado_${id}`)
        .classList.replace('d-none', 'd-block');

    document
        .getElementById(`btnSalvarExercicioCadastrado_${id}`)
        .classList.replace('d-block', 'd-none');

    desativado = true;

    alert('Exercício atualizado com sucesso!');
}

