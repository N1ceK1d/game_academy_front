$(document).ready(function() {
let allPlayersData = []; // Сохраняем все данные для поиска

$.ajax({
    url: 'https://game-academy.onrender.com/api/get_results',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
        allPlayersData = data.players; // Сохраняем данные игроков
        renderTable(data);
        initSearch();
    },
    error: function(xhr, status, error) {
        console.error('Ошибка:', error);
        $('.table_body').html('<p class="no-results">Ошибка загрузки данных</p>');
    }
});

function renderTable(data, filteredPlayers = null) {
    const playersToRender = filteredPlayers || data.players;
    const $table = $('<table class="results-table">');
    const $thead = $('<thead>');
    const $tbody = $('<tbody>');

    // Создаем заголовок таблицы
    const $headerRow1 = $('<tr>');
    const $headerRow2 = $('<tr>');
    
    $headerRow1.append($('<th rowspan="2">').text('Имя'));
    
    data.games.forEach(game => {
        $headerRow1.append(
            $('<th colspan="2">').text(game.name)
        );
        
        game.columns.forEach(column => {
            $headerRow2.append(
                $('<th>').text(column)
            );
        });
    });
    
    $headerRow1.append($('<th rowspan="2">').text('ИТОГИ'));
    $thead.append($headerRow1, $headerRow2);
    
    // Заполняем данные игроков
    if (playersToRender.length === 0) {
        $tbody.append(
            $('<tr>').append(
                $('<td colspan="' + (3 + data.games.length * 2) + '">')
                    .addClass('no-results')
                    .text('Игроки не найдены')
            )
        );
    } else {
        playersToRender.forEach(player => {
            const $row = $('<tr>');
            $row.append($('<td>').text(player.name));
            
            data.games.forEach(game => {
                const gameData = player.games[game.id] || {};
                
                $row.append(
                    $('<td>').text(gameData.score || '-'),
                    $('<td>').text(gameData.best || '-')
                );
            });
            
            $row.append($('<td class="total">').text(player.total || '-'));
            $tbody.append($row);
        });
    }
    
    $table.append($thead, $tbody);
    $('.table_body').empty().append($table);
}

function initSearch() {
        $('#searchInput').on('input', function() {
            const searchTerm = $(this).val().toLowerCase();
            
            if (searchTerm.length === 0) {
                // Если поисковая строка пуста, показываем всех игроков
                $.ajax({
                    url: 'https://game-academy.onrender.com/api/get_results',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        renderTable(data);
                    }
                });
                return;
            }
            
            // Фильтруем игроков по имени
            const filteredPlayers = allPlayersData.filter(player => 
                player.name.toLowerCase().includes(searchTerm)
            );
            
            // Получаем структуру данных для рендеринга
            $.ajax({
                url: 'https://game-academy.onrender.com/api/get_results',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    // Заменяем игроков на отфильтрованных
                    data.players = filteredPlayers;
                    renderTable(data, filteredPlayers);
                }
            });
        });
    }
});