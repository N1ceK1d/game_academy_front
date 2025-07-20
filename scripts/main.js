$(document).ready(function() {
    $.ajax({
        url: 'https://game-academy.onrender.com/api/get_results',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            renderTable(data);
        },
        error: function(xhr, status, error) {
            console.error('Ошибка:', error);
            $('.table_body').html('<p>Ошибка загрузки данных</p>');
        }
    });

    function renderTable(data) {
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
        data.players.forEach(player => {
            const $row = $('<tr>');
            $row.append($('<td>').text(player.name));
            
            data.games.forEach(game => {
                const gameData = player.games[game.id] || {};
                
                $row.append(
                    $('<td>').text(gameData.score || ''),
                    $('<td>').text(gameData.best || '')
                );
            });
            
            $row.append($('<td class="total">').text(player.total));
            $tbody.append($row);
        });
        
        $table.append($thead, $tbody);
        $('.table_body').empty().append($table);
    }
});