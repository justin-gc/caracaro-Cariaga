async function searchPokemon() {
    const pokemonName = document.getElementById("pokemon-name");
    const spriteFront = document.getElementById("sprite-front");
    const spriteBack = document.getElementById("sprite-back");
    const errorMessage = document.getElementById("error-message");
    const dataTable = document.getElementById("pokemon-data");

    try {
        const pokemon = document.getElementById("search-text").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        if (!response.ok) {
            throw new Error("No results found.");
        }

        // reset fields
        errorMessage.innerHTML = "";
        dataTable.innerHTML = "";

        const data = await response.json();
        console.log(data);

        // update ID and name
        pokemonName.innerHTML = `#${data.id} ${data.species.name.charAt(0).toUpperCase()}${data.species.name.slice(1)}`;

        // update sprites
        const imgFront = data.sprites.front_default;
        const imgBack = data.sprites.back_default;
        spriteFront.src = imgFront;
        spriteBack.src = imgBack;

        // types
        const types = data.types.map(entry => entry.type.name.charAt(0).toUpperCase() + entry.type.name.slice(1)).join("/");
        dataTable.innerHTML += `<tr>
                                    <td>Types</td>
                                    <td>${types}</td>
                                </tr>`;

        // abilities
        const abilities = data.abilities.map(entry => {
            const abilityName = entry.ability.name;
            if (entry.is_hidden) {
                return `${abilityName} (hidden)`;
            } else {
                return abilityName;
            }
        });

        dataTable.innerHTML += `<tr>
                                    <td>Abilities</td>
                                    <td id="ability-list"></td>
                                </tr>`;

        const abilityList = document.getElementById("ability-list")
        abilities.forEach(ability => {
            const entry = document.createElement("li");
            entry.textContent = (ability.charAt(0).toUpperCase() + ability.slice(1)).replace(/-/g, " ");
            abilityList.appendChild(entry);
        });

        console.log(abilities);

        // stats
        const stats = data.stats.map(entry => ({
            statName: entry.stat.name,
            statValue: entry.base_stat, 
        }));

        dataTable.innerHTML += `<tr>
                                    <td>Base Stats</td>
                                    <td id="stat-name-list"></td>
                                    <td id="stat-value-list"></td>
                                </tr>`;

        statNames = document.getElementById("stat-name-list");
        statValues = document.getElementById("stat-value-list");

        stats.forEach(entry => {
            const nameEntry = document.createElement("li");
            const valueEntry = document.createElement("li");

            nameEntry.textContent = entry.statName.charAt(0).toUpperCase() + entry.statName.slice(1).replace(/-/g, " ");
            valueEntry.textContent = entry.statValue;

            statNames.appendChild(nameEntry);
            statValues.appendChild(valueEntry);
        });
        
    } catch(error) {
        // display error
        errorMessage.innerHTML = error.message;

        // reset fields
        pokemonName.innerHTML = "";
        spriteFront.src = "";
        spriteBack.src = "";
        dataTable.innerHTML = "";

        console.error(error);
    }
}

const search = document.getElementById("search");

search.addEventListener("click", searchPokemon);