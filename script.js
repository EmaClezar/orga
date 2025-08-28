// Variáveis globais
let provaCounter = 1;
let metaCounter = 1;
let selectedCell = null;
let selectedDay = null;

// Dados para armazenamento local
let provas = JSON.parse(localStorage.getItem('provas')) || [];
let metas = JSON.parse(localStorage.getItem('metas')) || [];
let eventos = JSON.parse(localStorage.getItem('eventos')) || {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadProvas();
    loadMetas();
    generateCalendar();
    loadEventos();
});

// Funções para Provas
function addProva() {
    const container = document.getElementById('provas-container');
    
    // Criar formulário inline
    const form = document.createElement('div');
    form.className = 'inline-form';
    form.innerHTML = `
        <div style="display: flex; gap: 10px; margin: 10px 0; padding: 10px; background: #f7fafc; border-radius: 8px;">
            <input type="text" id="nova-data" placeholder="Data (DD/MM)" style="padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px;">
            <input type="text" id="nova-materia" placeholder="Matéria" style="padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; flex: 1;">
            <button onclick="salvarProva()" style="padding: 8px 12px; background: #4a5568; color: white; border: none; border-radius: 4px; cursor: pointer;">Salvar</button>
            <button onclick="cancelarProva()" style="padding: 8px 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
        </div>
    `;
    
    container.appendChild(form);
}

function salvarProva() {
    const data = document.getElementById('nova-data').value;
    const materia = document.getElementById('nova-materia').value;
    
    if (data && materia) {
        const prova = {
            id: Date.now(),
            data: data,
            materia: materia,
            concluida: false
        };
        
        provas.push(prova);
        saveProvas();
        renderProvas();
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

function cancelarProva() {
    const form = document.querySelector('.inline-form');
    if (form) {
        form.remove();
    }
}

function renderProvas() {
    const container = document.getElementById('provas-container');
    container.innerHTML = '';
    
    provas.forEach(prova => {
        const item = document.createElement('div');
        item.className = `item ${prova.concluida ? 'completed' : ''}`;
        item.innerHTML = `
            <input type="checkbox" id="prova${prova.id}" class="checkbox" ${prova.concluida ? 'checked' : ''} onchange="toggleProva(${prova.id})">
            <label for="prova${prova.id}" class="item-content">
                <span class="date">${prova.data}</span>
                <span class="description">${prova.materia}</span>
            </label>
            <button class="delete-btn" onclick="deleteProva(${prova.id})">×</button>
        `;
        container.appendChild(item);
    });
}

function toggleProva(id) {
    const prova = provas.find(p => p.id === id);
    if (prova) {
        prova.concluida = !prova.concluida;
        saveProvas();
        renderProvas();
    }
}

function deleteProva(id) {
    if (confirm('Tem certeza que deseja excluir esta prova?')) {
        provas = provas.filter(p => p.id !== id);
        saveProvas();
        renderProvas();
    }
}

function saveProvas() {
    localStorage.setItem('provas', JSON.stringify(provas));
}

function loadProvas() {
    renderProvas();
}

// Funções para Metas
function addMeta() {
    const container = document.getElementById('metas-container');
    
    // Criar formulário inline
    const form = document.createElement('div');
    form.className = 'inline-form-meta';
    form.innerHTML = `
        <div style="display: flex; gap: 10px; margin: 10px 0; padding: 10px; background: #f7fafc; border-radius: 8px;">
            <input type="text" id="nova-meta" placeholder="Descrição da meta" style="padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; flex: 1;">
            <button onclick="salvarMeta()" style="padding: 8px 12px; background: #4a5568; color: white; border: none; border-radius: 4px; cursor: pointer;">Salvar</button>
            <button onclick="cancelarMeta()" style="padding: 8px 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
        </div>
    `;
    
    container.appendChild(form);
}

function salvarMeta() {
    const descricao = document.getElementById('nova-meta').value;
    
    if (descricao) {
        const meta = {
            id: Date.now(),
            descricao: descricao,
            concluida: false
        };
        
        metas.push(meta);
        saveMetas();
        renderMetas();
    } else {
        alert('Por favor, preencha a descrição da meta!');
    }
}

function cancelarMeta() {
    const form = document.querySelector('.inline-form-meta');
    if (form) {
        form.remove();
    }
}

function renderMetas() {
    const container = document.getElementById('metas-container');
    container.innerHTML = '';
    
    metas.forEach(meta => {
        const item = document.createElement('div');
        item.className = `item ${meta.concluida ? 'completed' : ''}`;
        item.innerHTML = `
            <input type="checkbox" id="meta${meta.id}" class="checkbox" ${meta.concluida ? 'checked' : ''} onchange="toggleMeta(${meta.id})">
            <label for="meta${meta.id}" class="item-content">
                <span class="description">${meta.descricao}</span>
            </label>
            <button class="delete-btn" onclick="deleteMeta(${meta.id})">×</button>
        `;
        container.appendChild(item);
    });
}

function toggleMeta(id) {
    const meta = metas.find(m => m.id === id);
    if (meta) {
        meta.concluida = !meta.concluida;
        saveMetas();
        renderMetas();
    }
}

function deleteMeta(id) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
        metas = metas.filter(m => m.id !== id);
        saveMetas();
        renderMetas();
    }
}

function saveMetas() {
    localStorage.setItem('metas', JSON.stringify(metas));
}

function loadMetas() {
    renderMetas();
}

// Funções do Calendário
function generateCalendar() {
    const grid = document.getElementById('calendar-grid');
    const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    
    grid.innerHTML = '';
    
    horas.forEach(hora => {
        dias.forEach(dia => {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            cell.dataset.day = dia;
            cell.dataset.hour = hora;
            
            cell.innerHTML = `
                <div class="hour-label">${hora}</div>
                <div class="events-container" id="events-${dia}-${hora.replace(':', '')}"></div>
            `;
            
            cell.addEventListener('click', () => selectCell(cell, dia, hora));
            grid.appendChild(cell);
        });
    });
}

function selectCell(cell, dia, hora) {
    // Remove seleção anterior
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    
    // Seleciona nova célula
    selectedCell = cell;
    selectedDay = dia;
    selectedHour = hora;
    cell.classList.add('selected');
    
    // Abre modal para adicionar evento
    openModal();
}

function openModal() {
    document.getElementById('event-modal').style.display = 'block';
    document.getElementById('event-time').value = selectedHour;
}

function closeModal() {
    document.getElementById('event-modal').style.display = 'none';
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('event-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Formulário de evento
document.getElementById('event-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('event-title').value;
    const time = document.getElementById('event-time').value;
    
    if (title && selectedDay && time) {
        addEvento(selectedDay, time, title);
        closeModal();
        
        // Limpar formulário
        document.getElementById('event-title').value = '';
        document.getElementById('event-time').value = '';
    }
});

function addEvento(dia, hora, titulo) {
    const key = `${dia}-${hora}`;
    
    if (!eventos[key]) {
        eventos[key] = [];
    }
    
    const evento = {
        id: Date.now(),
        titulo: titulo,
        hora: hora
    };
    
    eventos[key].push(evento);
    saveEventos();
    renderEvento(dia, hora, evento);
}

function renderEvento(dia, hora, evento) {
    const containerId = `events-${dia}-${hora.replace(':', '')}`;
    const container = document.getElementById(containerId);
    
    if (container) {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.innerHTML = `
            ${evento.titulo}
            <button class="delete-btn" onclick="deleteEvento('${dia}', '${hora}', ${evento.id})" style="margin-left: 5px; font-size: 10px;">×</button>
        `;
        container.appendChild(eventElement);
    }
}

function deleteEvento(dia, hora, eventoId) {
    const key = `${dia}-${hora}`;
    if (eventos[key]) {
        eventos[key] = eventos[key].filter(e => e.id !== eventoId);
        if (eventos[key].length === 0) {
            delete eventos[key];
        }
        saveEventos();
        loadEventos();
    }
}

function saveEventos() {
    localStorage.setItem('eventos', JSON.stringify(eventos));
}

function loadEventos() {
    // Limpar todos os eventos existentes
    document.querySelectorAll('.events-container').forEach(container => {
        container.innerHTML = '';
    });
    
    // Renderizar todos os eventos salvos
    Object.keys(eventos).forEach(key => {
        const [dia, hora] = key.split('-');
        eventos[key].forEach(evento => {
            renderEvento(dia, hora, evento);
        });
    });
}

// Função para limpar todos os dados (útil para desenvolvimento)
function clearAllData() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.clear();
        provas = [];
        metas = [];
        eventos = {};
        renderProvas();
        renderMetas();
        loadEventos();
    }
}

// Adicionar botão de limpar dados (apenas para desenvolvimento)
document.addEventListener('DOMContentLoaded', function() {
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Limpar Todos os Dados';
    clearBtn.style.position = 'fixed';
    clearBtn.style.bottom = '10px';
    clearBtn.style.right = '10px';
    clearBtn.style.padding = '5px 10px';
    clearBtn.style.backgroundColor = '#e53e3e';
    clearBtn.style.color = 'white';
    clearBtn.style.border = 'none';
    clearBtn.style.borderRadius = '4px';
    clearBtn.style.cursor = 'pointer';
    clearBtn.style.fontSize = '12px';
    clearBtn.onclick = clearAllData;
    document.body.appendChild(clearBtn);
});

