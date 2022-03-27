SELECT game.id,game.name,game.studio,game.price,game.description,game.date,game.image, GROUP_CONCAT(category.name) AS category FROM game
JOIN game_to_category ON game_to_category.game_id = game.id
join category ON category.id = game_to_category.category_id
ORDER BY game.name