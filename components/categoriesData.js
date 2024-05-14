// ./components/categoriesData.js
export const categoriesData = [
    {
        id: 'animals',
        title: 'Gyvūnai',
        image: require('../assets/pets.png'),
        images: [
            { id: 'a1', src: require('../assets/images/animals/dog.png'), description: 'Šuo', score: 0 },
            { id: 'a2', src: require('../assets/images/animals/cat.png'), description: 'Katė', score: 3 },
            { id: 'a3', src: require('../assets/images/animals/bird.png'), description: 'Paukštis', score: 0 },
            // { id: 'a4', src: require('../assets/images/cow.png'), description: 'Karvė', score: 0 },
        ],
    },
    {
        id: 'foods',
        title: 'Maistas',
        image: require('../assets/food.png'),
        images: [
            { id: 'f1', src: require('../assets/images/food/apple.png'), description: 'Obuolys', score: 2 },
            { id: 'f2', src: require('../assets/images/food/banana.png'), description: 'Bananas', score: 0 },
            { id: 'f3', src: require('../assets/images/food/sandwich.png'), description: 'Sumuštinis', score: 0 },
            { id: 'f4', src: require('../assets/images/food/water-bottle.png'), description: 'Vanduo', score: 0 },
        ],
    },
    {
        id: 'activities',
        title: 'Veikla',
        image: require('../assets/activities.png'),
        images: [
            { id: 'ac1', src: require('../assets/images/activities/sleep.png'), description: 'Miegoti', score: 0 },
            { id: 'ac2', src: require('../assets/images/activities/eat.png'), description: 'Valgyti', score: 0 },
            // { id: 'ac3', src: require('../assets/a.png'), description: 'Žaisti', score: 0 },
            // { id: 'ac4', src: require('../assets/b.png'), description: 'Piešti', score: 0 },
            { id: 'ac5', src: require('../assets/images/activities/read.png'), description: 'Skaityti', score: 0 },
            { id: 'ac6', src: require('../assets/images/activities/write.png'), description: 'Rašyti', score: 0 },
            
        ],
    },
    {
        id: 'clothing',
        title: 'Apranga',
        image: require('../assets/clothes.png'),
        images: [
            { id: 'cl1', src: require('../assets/images/clothes/shirt.png'), description: 'Marškinėliai', score: 0 },
            { id: 'cl2', src: require('../assets/images/clothes/pants.png'), description: 'Kelnės', score: 0 },
            { id: 'cl3', src: require('../assets/images/clothes/sweater.png'), description: 'Megztinis', score: 0 },
            { id: 'cl4', src: require('../assets/images/clothes/shoes.png'), description: 'Batai', score: 0 },
        ],
    },
    {
        id: 'emotions',
        title: 'Emocijos',
        image: require('../assets/emotions.png'),
        images: [
            { id: 'e1', src: require('../assets/images/emotions/happy.png'), description: 'Laimingas', score: 0 },
            { id: 'e2', src: require('../assets/images/emotions/sad.png'), description: 'Liūdnas', score: 0 },
            { id: 'e3', src: require('../assets/images/emotions/angry.png'), description: 'Piktas', score: 0 },
            { id: 'e4', src: require('../assets/images/emotions/surprised.png'), description: 'Nustebęs', score: 0 },
        ],
    },
    {
        id: 'people',
        title: 'Žmonės',
        image: require('../assets/family.png'),
        images: [
            { id: 'p1', src: require('../assets/images/people/mother.png'), description: 'Mama', score: 0 },
            { id: 'p2', src: require('../assets/images/people/father.png'), description: 'Tėtis', score: 0 },
            { id: 'p3', src: require('../assets/images/people/son.png'), description: 'Brolis', score: 0 },
            { id: 'p4', src: require('../assets/images/people/daughter.png'), description: 'Sesė', score: 0 },
            { id: 'p5', src: require('../assets/images/people/grandmother.png'), description: 'Močiutė', score: 0 },
            { id: 'p6', src: require('../assets/images/people/grandfather.png'), description: 'Senelis', score: 0 },
            // { id: 'p3', src: require('../assets/a.png'), description: 'Brolis', score: 0 },
            // { id: 'p4', src: require('../assets/b.png'), description: 'Sesė', score: 0 },
        ],
    },
    {
        id: 'colors',
        title: 'Spalvos',
        image: require('../assets/colors.png'),
        images: [
            { id: 'c1', src: require('../assets/images/colors/green.png'), description: 'Žalia', score: 0 },
            { id: 'c2', src: require('../assets/images/colors/blue.png'), description: 'Mėlyna', score: 0 },
            // { id: 'c3', src: require('../assets/a.png'), description: 'Geltona', score: 0 },
            { id: 'c4', src: require('../assets/images/colors/red.png'), description: 'Raudona', score: 0 },
            // { id: 'c5', src: require('../assets/b.png'), description: 'Balta', score: 0 },
            // { id: 'c6', src: require('../assets/b.png'), description: 'Juoda', score: 0 },
        ],
    },
    {
        id: 'shapes',
        title: 'Formos',
        image: require('../assets/images/shapes/square.png'),
        images: [
            { id: 's1', src: require('../assets/images/shapes/circle.png'), description: 'Apskritimas', score: 0 },
            { id: 's2', src: require('../assets/images/shapes/square.png'), description: 'Kvadratas', score: 0 },
            { id: 's3', src: require('../assets/images/shapes/triangle.png'), description: 'Trikampis', score: 0 },
            { id: 's4', src: require('../assets/images/shapes/star.png'), description: 'Žvaigždė', score: 0 },
        ],
    },
    {
        id: 'numbers',
        title: 'Skaičiai',
        image: require('../assets/images/numbers/number-1.png'),
        images: [
            { id: 'n1', src: require('../assets/images/numbers/number-1.png'), description: 'Vienas', score: 0 },
            { id: 'n2', src: require('../assets/images/numbers/number-2.png'), description: 'Du', score: 0 },
            { id: 'n3', src: require('../assets/images/numbers/number-3.png'), description: 'Trys', score: 0 },
            { id: 'n4', src: require('../assets/images/numbers/number-4.png'), description: 'Keturi', score: 0 },
            { id: 'n5', src: require('../assets/images/numbers/number-5.png'), description: 'Penki', score: 0 },
            { id: 'n6', src: require('../assets/images/numbers/number-6.png'), description: 'Šeši', score: 0 },
            { id: 'n7', src: require('../assets/images/numbers/number-7.png'), description: 'Septyni', score: 0 },
            { id: 'n8', src: require('../assets/images/numbers/number-8.png'), description: 'Aštuoni', score: 0 },
            { id: 'n9', src: require('../assets/images/numbers/number-9.png'), description: 'Devyni', score: 0 },
            { id: 'n10', src: require('../assets/images/numbers/number-10.png'), description: 'Dešimt', score: 0 },
        ],
    },
    // {
    //     id: 'letters',
    //     title: 'Letters',
    //     image: require('../assets/b.png'),
    //     images: [
    //         { id: 'l1', src: require('../assets/a.png'), description: 'A', score: 0 },
    //         { id: 'l2', src: require('../assets/b.png'), description: 'B', score: 0 },
    //         { id: 'l3', src: require('../assets/a.png'), description: 'C', score: 0 },
    //         { id: 'l4', src: require('../assets/b.png'), description: 'D', score: 0 },
    //     ],
    // },
];

export default categoriesData;