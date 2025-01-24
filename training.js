const trainingData = [];
const player = { x: 100, y: 200, vX: 0, vY: -5 };
const platforms = [
    { x: 150, y: 300 },
    { x: 200, y: 150 },
    { x: 50, y: 100 },
    { x: 400, y: 500 },
];
const action = [0, 0, 1];

function getClosestPlatforms(player, platforms, count) {
    const distances = platforms.map(platform => {
        const dx = platform.x - player.x;
        const dy = platform.y - player.y;
        return {
            platform,
            distance: Math.sqrt(dx * dx + dy * dy)
        };
    });

    // Sort platforms by distance
    distances.sort((a, b) => a.distance - b.distance);

    // Return the closest platforms
    return distances.slice(0, count).map(d => d.platform);
}

// Collecter les données des plateformes les plus proches
const closestPlatforms = getClosestPlatforms(player, platforms, 3);

// Préparer les données
trainingData.push({
    input: [
        player.x, player.y, player.vX, player.vY, // Position et vitesse du joueur
        ...closestPlatforms.flatMap(p => [p.x, p.y]), // Coordonnées des plateformes proches
    ],
    output: action, // Action prise par le joueur
});

// Structure finale
console.log(trainingData);
