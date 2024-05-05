// const codeYouRepository = {
//     get: (): any => {
//         return {
//             name: "Code You",
//             other_names: ["Code Louisville", "Code Kentucky"],
//             fearless_leader: "Brian Luerman"
//         };

//     }
// };

//module.exports = codeYouRepository;

export class CharacterRepository {
    private characterData = {
        name: "Cartoon Characters",
        characters: [
            {
                name: "Dexter",
                show: "Dexter's Lab",
                network: "Cartoon Network"
            },
            {
                name: "Aang",
                show: "Avatar: The Last Airbender",
                network: "Nickelodeon"
            },
            {
                name: "Kirby",
                show: "Kirby: Right Back At Ya!",
                network: "Fox"
            }
        ]
    };

    constructor() {}

    public addCharacterData = async (character: any) => {
        this.characterData.characters.push(character);
    }

    public returnCharacterData = () => {
        return this.characterData;
    };
}
