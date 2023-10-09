"user strict";
const express = require("express");
const app = express();
const fs = require("fs");
const cors = require('cors');
const port = process.env.PORT || 8080//9215;

const corsOptions = {
    origin: 'https://maximkim.com'
  };
  
app.use(cors(corsOptions));

// const prompts = [
//     ["a","b","c"],
//     ["a1","b1","c1"],
//     ["a2","b2",'c2'],
//     ['a3','b3','c3'],
// ]

//https://blog.prepscholar.com/sat-vocabulary-words credits here. I took the website's table to a spreadsheet
//and converted it into a list of JSON objects using this tutorial https://thenewstack.io/how-to-convert-google-spreadsheet-to-json-formatted-text/
const satWords = [
    {
        "word": "Abate",
        "definition": "v. to become less active, less intense, or less in amount",
        "exampleSentence": "As I began my speech, my feelings of nervousness quickly abated."
    },
    {
        "word": "Abstract",
        "definition": "adj. existing purely in the mind; not representing actual reality",
        "exampleSentence": "Julie had trouble understanding the appeal of the abstract painting."
    },
    {
        "word": "Abysmal",
        "definition": "adj. extremely bad",
        "exampleSentence": "I got an abysmal grade on my research paper!"
    },
    {
        "word": "Accordingly",
        "definition": "adv. in accordance with",
        "exampleSentence": "All students must behave accordingly."
    },
    {
        "word": "Acquisition",
        "definition": "n. the act of gaining a skill or possession of something",
        "exampleSentence": "Language acquisition is easier for kids than it is for adults."
    },
    {
        "word": "Adapt",
        "definition": "v. to make suit a new purpose\nv. to accommodate oneself to a new condition, setting, or situation",
        "exampleSentence": "The US has adapted many foreign foods to better suit the tastes of Americans.\nDogs are known for their ability to quickly adapt to their environments."
    },
    {
        "word": "Adept",
        "definition": "adj. having knowledge or skill (usu. in a particular area)",
        "exampleSentence": "Beth loves playing the piano, but she’s especially adept at the violin."
    },
    {
        "word": "Adequate", 
        "definition": "adj. having sufficient qualifications to meet a specific task or purpose",
        "exampleSentence": "Though his resume was adequate, the company doubted whether he’d be a good fit."
    },
    {
        "word": "Advent",
        "definition": "n. the arrival or creation of something (usu. historic)",
        "exampleSentence": "The world has never been the same since the advent of the light bulb."
    },
    {
        "word": "Adversarial",
        "definition": "adj. relating to hostile opposition",
        "exampleSentence": "An adversarial attitude will make you many enemies in life."
    },
    {
        "word": "Advocate",
        "definition": "n. someone who promotes or defends something\nv. to defend or promote something (usu. a belief, theory, opinion, etc.)",
        "exampleSentence": "I am an advocate for free higher education.\nEnvironmental protesters often advocate for cleaner energy practices."
    },
    {
        "word": "Aesthetic",
        "definition": "adj. relating to beauty or refined taste",
        "exampleSentence": "The aesthetic decorations at the wedding reception made you feel as if you were a character in a fairy tale."
    },
    {
        "word": "Afford",
        "definition": "v. to be able to buy\nv. to be able to spare",
        "exampleSentence": "He’s saving money so he can afford to buy a new car.\nI can’t afford to lose any more pencils!"
    },
    {
        "word": "Agitate",
        "definition": "v. to promote something (usu. a cause)",
        "exampleSentence": "They’re agitating for better health care."
    },
    {
        "word": "Allow",
        "definition": "v. to permit or consent to",
        "exampleSentence": "US law allows citizens to speak freely."
    },
    {
        "word": "Allude",
        "definition": "v. to make a secretive mention of something",
        "exampleSentence": "She alluded to the problem at hand but didn’t say anything more about it."
    },
    {
        "word": "Altercation",
        "definition": "n. a noisy argument or confrontation",
        "exampleSentence": "Greg got into an altercation with a stranger at the bar."
    },
    {
        "word": "Ambiguous",
        "definition": "adj. unclear or vague in meaning",
        "exampleSentence": "Her ambiguous statement made me question whether she could be trusted."
    },
    {
        "word": "Ambitious",
        "definition": "adj. having a powerful desire for success or achievement",
        "exampleSentence": "Penny is so ambitious, she wants to be president someday."
    },
    {
        "word": "Ambivalence",
        "definition": "n. the state of being uncertain or stuck between two or more options",
        "exampleSentence": "His ambivalence prevented him from immediately signing the contract."
    },
    {
        "word": "Analogous",
        "definition": "adj. similar but not identical",
        "exampleSentence": "Green onions are considered analogous to spring onions."
    },
    {
        "word": "Annihilate",
        "definition": "v. to destroy or cause devastating destruction",
        "exampleSentence": "The dictator sent orders to annihilate the group of rebels."
    },
    {
        "word": "Anomaly",
        "definition": "n. something different from the norm",
        "exampleSentence": "This result is an anomaly and very rarely happens."
    },
    {
        "word": "Anticipate",
        "definition": "v. assume to be likely to happen",
        "exampleSentence": "The party was just as fun as I had anticipated it would be."
    },
    {
        "word": "Antipathy",
        "definition": "n. a strong feeling of dislike",
        "exampleSentence": "Her antipathy toward the professor was obvious: she rolled her eyes whenever he entered the classroom."
    },
    {
        "word": "Apex",
        "definition": "n. the highest point of something",
        "exampleSentence": "The spring play was the apex of our school year."
    },
    {
        "word": "Apprehension",
        "definition": "n. fearful expectation of something",
        "exampleSentence": "Her apprehension to leave her house resulted in her missing the train."
    },
    {
        "word": "Articulate",
        "definition": "v. to clearly express in words",
        "exampleSentence": "She articulated her opinion on the price of the house."
    },
    {
        "word": "Artificial",
        "definition": "adj. something made; not occurring naturally",
        "exampleSentence": "Many candies use artificial flavors to make them taste fruity."
    },
    {
        "word": "Assertion",
        "definition": "n. a strong declaration",
        "exampleSentence": "His assertion that sharks are mammals made everyone laugh."
    },
    {
        "word": "Austere",
        "definition": "adj. extremely plain\nadj. stern and forbidding\nadj. relating to self-denial",
        "exampleSentence": "He lived in a small, austere cabin in the middle of the woods.\nMy boss had an austere expression on her face.\nAn austere lifestyle, like that of monks, isn’t for everybody."
    },
    {
        "word": "Authenticity",
        "definition": "n. the quality of being real and true instead of fake and contrived",
        "exampleSentence": "The police officer doubted the authenticity of the suspect’s story."
    },
    {
        "word": "Avenue",
        "definition": "n. an intangible path or approach to something",
        "exampleSentence": "The company has decided to pursue other avenues."
    },
    {
        "word": "Avid",
        "definition": "adj. actively interested in or enthusiastic about something",
        "exampleSentence": "Gerald is an avid soccer fan."
    },
    {
        "word": "Basic",
        "definition": "adj. relating to the foundation or basis of something",
        "exampleSentence": "You have to start with basic Russian before you can move on to the advanced level."
    },
    {
        "word": "Bear",
        "definition": "v. to have as a characteristic\nv. to have (a child)\nv. to bring forth\nv. to put up with",
        "exampleSentence": "She bears a strong resemblance to your mother.\nJudy will bear her first child later this year.\nMy garden is going to bear pumpkins this year.\nI can’t bear her complaining any longer!"
    },
    {
        "word": "Benevolent",
        "definition": "adj. kind, generous",
        "exampleSentence": "Many cultures believe in benevolent spirits."
    },
    {
        "word": "Bias",
        "definition": "n. a preconception that prevents objectivity",
        "exampleSentence": "It’s important to avoid bias when investigating a crime."
    },
    {
        "word": "Bittersweet",
        "definition": "adj. tinged with a feeling of sadness",
        "exampleSentence": "The ending of the romance movie was bittersweet."
    },
    {
        "word": "Bolster",
        "definition": "v. to support, strengthen, or fortify",
        "exampleSentence": "If we work together, we should be able to lift and then bolster the couch."
    },
    {
        "word": "Boost",
        "definition": "n. an increase or growth\nv. to increase or make grow",
        "exampleSentence": "The boost in profits was a welcome change.\nIn order to boost profits, you need to cater to your customers."
    },
    {
        "word": "Brawl",
        "definition": "n. an intense, loud fight\nv. to fight loudly and disruptively",
        "exampleSentence": "A brawl broke out at school today after one student accused another of cheating.\nThe two students brawled for an hour."
    },
    {
        "word": "Brevity",
        "definition": "n. the quality of being brief or terse",
        "exampleSentence": "The brevity of their time together made it all the more romantic."
    },
    {
        "word": "Candid",
        "definition": "adj. direct, blunt",
        "exampleSentence": "Josh is candid about his desire to become an actor."
    },
    {
        "word": "Candor",
        "definition": "n. the trait of being honest and frank",
        "exampleSentence": "I admire her candor, especially when nobody else bothers to speak up."
    },
    {
        "word": "Capitalize",
        "definition": "v. to use to your advantage",
        "exampleSentence": "I’d like to capitalize on your math skills by having your work the cash register."
    },
    {
        "word": "Capture",
        "definition": "v. to trap or take possession of\nv. to successfully represent or imitate\nv. to captivate, mesmerize\nv. to catch or seize",
        "exampleSentence": "The spy was captured by the enemy.\nYour painting beautifully captures the ephemerality of life.\nI was captured by her beauty.\nThe cops captured the criminal three days after the incident."
    },
    {
        "word": "Civic",
        "definition": "adj. relating to the city or citizens",
        "exampleSentence": "Voting is a civic duty."
    },
    {
        "word": "Clinical",
        "definition": "adj. emotionally unattached (usu. used in medical or scientific setting)",
        "exampleSentence": "Her clinical approach to situations allows her to handle them more effectively."
    },
    {
        "word": "Clout",
        "definition": "n. special advantage or power",
        "exampleSentence": "Children of rich and famous people often believe they have a lot of clout."
    },
    {
        "word": "Coarse",
        "definition": "adj. indicating a rough texture\nadj. lacking refinement or sophistication",
        "exampleSentence": "The horse’s mane was coarse, as if it had never been washed.\nThe queen’s coarse way of speaking surprised the other members of royalty."
    },
    {
        "word": "Coincide",
        "definition": "v. to happen at the same time",
        "exampleSentence": "It wasn’t until after I booked my ticket that I realized the concert coincided with my finals."
    },
    {
        "word": "Commission",
        "definition": "n. the use of payment to request something (e.g., a service or product)",
        "exampleSentence": "This painting was commissioned by a rich merchant in 1589."
    },
    {
        "word": "Comparable",
        "definition": "adj. able to be compared",
        "exampleSentence": "This novel is comparable to Huckleberry Finn."
    },
    {
        "word": "Competent",
        "definition": "adj. sufficiently qualified",
        "exampleSentence": "We need to hire a competent web developer to create a good website for our company."
    },
    {
        "word": "Complacent",
        "definition": "adj. satisfied, with no desire to change or improve",
        "exampleSentence": "Though he had never won any awards or even been published, he was complacent with his life as a poet."
    },
    {
        "word": "Complement",
        "definition": "v. to make perfect or complete",
        "exampleSentence": "This wine perfectly complements this platter of gourmet cheese."
    },
    {
        "word": "Concede",
        "definition": "v. to be forced to agree or surrender\nv. to admit to a transgression",
        "exampleSentence": "With no chance of winning the battle, the army at last conceded.\nDan conceded to pranking his sister."
    },
    {
        "word": "Conceive",
        "definition": "v. to imagine or come up with",
        "exampleSentence": "The plan to build the city was originally conceived in the early 1900s."
    },
    {
        "word": "Condone",
        "definition": "v. to overlook, approve, or allow",
        "exampleSentence": "She couldn't condone her daughter's rebellious behavior."
    },
    {
        "word": "Conducive",
        "definition": "adj. able to bring about or be suitable for",
        "exampleSentence": "The noisy students hardly made the campus library conducive to studying."
    },
    {
        "word": "Conduct",
        "definition": "v. to control or manage\nv. to behave a certain way",
        "exampleSentence": "The group conducted their research abroad last year.\nBe sure to conduct yourself accordingly."
    },
    {
        "word": "Confide",
        "definition": "v. to share something secretive with someone",
        "exampleSentence": "She confided all of her biggest secrets in her best friend."
    },
    {
        "word": "Confine",
        "definition": "v. to put limits on; to restrict",
        "exampleSentence": "We are going to confine the use of this drinking fountain."
    },
    {
        "word": "Consensus",
        "definition": "n. overall agreement",
        "exampleSentence": "After weeks of debating, the panel finally came to a consensus."
    },
    {
        "word": "Constitute",
        "definition": "v. to form or compose (part of) something",
        "exampleSentence": "The desire for equality constituted the civil rights movement."
    },
    {
        "word": "Contemplate",
        "definition": "v. to think deeply about",
        "exampleSentence": "She contemplated telling her teacher about the cheating student."
    },
    {
        "word": "Contend",
        "definition": "v. to maintain or assert (an opinion)",
        "exampleSentence": "The president contends that the US government will not negotiate with terrorists."
    },
    {
        "word": "Contradict",
        "definition": "v. to be in contrast with",
        "exampleSentence": "The camera footage contradicts his alibi."
    },
    {
        "word": "Controversial",
        "definition": "adj. highly debatable and causing contention",
        "exampleSentence": "Millions of viewers watched the controversial debate take place."
    },
    {
        "word": "Conventional",
        "definition": "adj. abiding by accepted standards",
        "exampleSentence": "She lives a conventional life in the suburbs."
    },
    {
        "word": "Convey",
        "definition": "v. to pass on or transfer (information)",
        "exampleSentence": "I have trouble conveying my thoughts in French."
    },
    {
        "word": "Conviction",
        "definition": "n. a firm belief in something",
        "exampleSentence": "Her religious convictions prevent her from eating meat."
    },
    {
        "word": "Corroborate",
        "definition": "v. to provide evidence for; to back up (a claim)",
        "exampleSentence": "The note signed by her father corroborates her claim that she was absent from class that day."
    },
    {
        "word": "Counteract",
        "definition": "v. to work in opposition to",
        "exampleSentence": "This ingredient seems to counteract the other ones."
    },
    {
        "word": "Counterargument",
        "definition": "n. an argument used to criticize or dismantle another argument",
        "exampleSentence": "Make sure to include a counterargument in your essay so that you can show you’ve considered the topic from all perspectives."
    },
    {
        "word": "Counterproductive",
        "definition": "adj. hindering the achievement of a goal",
        "exampleSentence": "Bill’s idea to take a shortcut was ultimately counterproductive: it took us twice as long to get to the train station."
    },
    {
        "word": "Culmination",
        "definition": "n. the final act or climax",
        "exampleSentence": "The culmination of the performance was unforgettable."
    },
    {
        "word": "Cultivate",
        "definition": "v. to foster the growth of",
        "exampleSentence": "Teachers don’t just pass on new information to students—they cultivate their academic potential."
    },
    {
        "word": "Decree",
        "definition": "v. to declare formally and with authority",
        "exampleSentence": "The president decreed that Halloween would henceforth be a national holiday."
    },
    {
        "word": "Deference",
        "definition": "n. respect; regard",
        "exampleSentence": "Her deference to the elderly makes her the perfect candidate for an internship at the retirement center."
    },
    {
        "word": "Deficient",
        "definition": "adj. not enough in degree or amount",
        "exampleSentence": "I feel as though the sources for my paper are deficient."
    },
    {
        "word": "Demonstrate",
        "definition": "v. to do as an example\nv. gives evidence for",
        "exampleSentence": "Could you demonstrate the dance move for me?\nThis book’s use of words such as “grim” and “bleak” demonstrates the author’s mournful tone."
    },
    {
        "word": "Demur",
        "definition": "v. to object to",
        "exampleSentence": "She demurred at my request to transfer to a different department."
    },
    {
        "word": "Deplete",
        "definition": "v. to (over)use over time (usu. resources)",
        "exampleSentence": "The lost campers quickly depleted their supply of food."
    },
    {
        "word": "Desolate",
        "definition": "adj. bare, barren, empty",
        "exampleSentence": "The moon is one giant, desolate landscape."
    },
    {
        "word": "Devise",
        "definition": "v. to come up with (a plan)",
        "exampleSentence": "Lana devised a plan to make herself famous."
    },
    {
        "word": "Dilemma",
        "definition": "n. a problem, usually requiring a choice between two options",
        "exampleSentence": "The main dilemma is whether to pay for a commercial or not."
    },
    {
        "word": "Diligence",
        "definition": "n. conscientiousness; the quality of being committed to a task",
        "exampleSentence": "Diligence and confidence will get you far in life."
    },
    {
        "word": "Diminish",
        "definition": "v. to become smaller in scope or degree",
        "exampleSentence": "The itchiness of mosquito bites usually starts to diminish after a few days."
    },
    {
        "word": "Dire",
        "definition": "adj. hopeless and dangerous or fearful",
        "exampleSentence": "When the police didn’t explain what was happening right away, Jane knew that the situation must be dire."
    },
    {
        "word": "Discord",
        "definition": "n. disagreement",
        "exampleSentence": "Disputes over money caused intense discord in the family."
    },
    {
        "word": "Disdain",
        "definition": "n. a lack of respect and strong dislike (toward something or someone)",
        "exampleSentence": "He looked at me with such disdain that I immediately knew the job wouldn’t work out."
    },
    {
        "word": "Dismay",
        "definition": "n. hopelessness, stress, or consternation\nv. to fill with woe or apprehension",
        "exampleSentence": "To Nick’s dismay, he got an F on the test.\nMany were dismayed by the town’s implementation of metered parking."
    },
    {
        "word": "Disparage",
        "definition": "v. to belittle or speak down to",
        "exampleSentence": "A good boss is stern but never disparages his or her employees."
    },
    {
        "word": "Dispatch",
        "definition": "v. to send off a message or messenger",
        "exampleSentence": "The mother dispatched her daughter to their neighbor’s house."
    },
    {
        "word": "Diversification",
        "definition": "n. the act of becoming diverse",
        "exampleSentence": "Lately, there’s been noticeable diversification of students at higher institutions."
    },
    {
        "word": "Doctrine",
        "definition": "n. a principle, theory, or position, usu. advocated by a religion or gov’t",
        "exampleSentence": "Devoutly religious people often live their lives according to their doctrines."
    },
    {
        "word": "Dominion",
        "definition": "n. power and authority (usu. over a territory)\nn. a legal territory",
        "exampleSentence": "The country claimed to have dominion over parts of Russia.\nPuerto Rico is a dominion of the US."
    },
    {
        "word": "Dreary",
        "definition": "adj. sad, gloomy, dull",
        "exampleSentence": "The gray clouds in the sky made the day feel dreary."
    },
    {
        "word": "Dubious",
        "definition": "adj. doubtful, questionable",
        "exampleSentence": "The man’s claims to the throne were dubious since nobody knew where he’d come from."
    },
    {
        "word": "Eccentric",
        "definition": "adj. peculiar or odd; deviating from the norm",
        "exampleSentence": "She’s a little eccentric but still fun to be around."
    },
    {
        "word": "Egregious",
        "definition": "adj. extremely bad",
        "exampleSentence": "After cheating on the exam, Emily began to feel as though she’d made an egregious mistake."
    },
    {
        "word": "Eloquent",
        "definition": "adj. having refined or expressive communication skills (in speaking or writing)",
        "exampleSentence": "His speech was not only eloquent but also extremely compelling."
    },
    {
        "word": "Eminent",
        "definition": "adj. superior or distinguished; high in position or status",
        "exampleSentence": "Our town made news when the eminent magician came to perform at our local theater."
    },
    {
        "word": "Emit",
        "definition": "v. to discharge, give forth, or release",
        "exampleSentence": "Plants consume carbon dioxide and emit oxygen."
    },
    {
        "word": "Emphatic",
        "definition": "adj. very expressive; using emphasis",
        "exampleSentence": "Her emphatic smile told me she was excited to ride the roller coaster."
    },
    {
        "word": "Empirical",
        "definition": "adj. derived from experience, observation, or an experiment",
        "exampleSentence": "You need empirical evidence to support your claim."
    },
    {
        "word": "Endow",
        "definition": "v. to equip or bestow (usu. a quality or ability)",
        "exampleSentence": "According to the myth, the gods endowed him with the gift of healing."
    },
    {
        "word": "Endure",
        "definition": "v. to withstand, sustain, or hold out against",
        "exampleSentence": "I can’t endure this wait any longer. Will Stanford accept or reject me?"
    },
    {
        "word": "Entail",
        "definition": "v. to involve or include",
        "exampleSentence": "A doctoral program entails long nights and a heavy workload."
    },
    {
        "word": "Entrenched",
        "definition": "adj. firmly established",
        "exampleSentence": "Her face will forever be entrenched in my memory."
    },
    {
        "word": "Enumerate",
        "definition": "v. to specify or count",
        "exampleSentence": "I can’t enumerate how many times I’ve had to remind my students when their papers are due."
    },
    {
        "word": "Envy",
        "definition": "n. excessive jealousy\nv. to admire and be jealous of",
        "exampleSentence": "His envy of her is quite obvious.\nShe envies her coworker's social skills."
    },
    {
        "word": "Erratic",
        "definition": "adj. having no fixed course; deviating from the norm",
        "exampleSentence": "The car became erratic after slipping on ice."
    },
    {
        "word": "Establish",
        "definition": "v. to enact\nv. to found (a business, group, school, etc.)",
        "exampleSentence": "They established a law that made it illegal to drive after drinking any amount of alcohol.\nOur group established a new branch in Chicago."
    },
    {
        "word": "Evoke",
        "definition": "v. to draw forth or call up",
        "exampleSentence": "Horror movies are great at evoking fear."
    },
    {
        "word": "Exacerbate",
        "definition": "v. to make worse or increase the severity of",
        "exampleSentence": "The doctor told me not to run as it can exacerbate my knee injury."
    },
    {
        "word": "Excel",
        "definition": "v. to do something extremely well or to be superior in",
        "exampleSentence": "She was a well-rounded student but excelled especially in science."
    },
    {
        "word": "Exert",
        "definition": "v. to put into use (usu. as effort)",
        "exampleSentence": "Don’t exert all of your energy at once."
    },
    {
        "word": "Exhilarating",
        "definition": "adj. invigorating, stimulating, or exciting",
        "exampleSentence": "The music playing at the club was catchy and exhilarating."
    },
    {
        "word": "Expend",
        "definition": "v. to use up (as in energy or money)",
        "exampleSentence": "Be careful not to expend all your energy in the first half of a marathon."
    },
    {
        "word": "Exploit",
        "definition": "v. to use selfishly or for profit",
        "exampleSentence": "The shoddy company exploited its workers by paying them extremely low wages."
    },
    {
        "word": "Facilitate",
        "definition": "v. to aid the progress of",
        "exampleSentence": "In grad school, advisors facilitate students’ research and offer constructive criticism."
    },
    {
        "word": "Feasibility",
        "definition": "n. the practicality or possibility of something",
        "exampleSentence": "The feasibility of her project was doubtful; she’d have to go all the way to Antarctica and back before the school year ended."
    },
    {
        "word": "Ferocity",
        "definition": "n. viciousness, violence",
        "exampleSentence": "The lion is just one wild animal known for its ferocity."
    },
    {
        "word": "Fiscal",
        "definition": "adj. related to (government) money",
        "exampleSentence": "Fiscal policy is how the government uses money to influence the economy."
    },
    {
        "word": "Flourish",
        "definition": "v. to prosper, grow, or make fast progress",
        "exampleSentence": "After one year, the tiny plants had flourished into a breathtaking garden."
    },
    {
        "word": "Fluctuate",
        "definition": "v. to be unstable; to rise and fall",
        "exampleSentence": "Stocks can fluctuate on a daily basis, making it difficult to determine when to buy or sell one."
    },
    {
        "word": "Foment",
        "definition": "v. to stir up",
        "exampleSentence": "The civilians accused their leader of fomenting political unrest."
    },
    {
        "word": "Foreseeable",
        "definition": "adj. capable of being predicted or anticipated",
        "exampleSentence": "I can't imagine aliens visiting us in the foreseeable future."
    },
    {
        "word": "Frankly",
        "definition": "adv. directly, clearly",
        "exampleSentence": "I frankly don’t see the point in learning to drive."
    },
    {
        "word": "Freewheeling",
        "definition": "adj. carefree",
        "exampleSentence": "His freewheeling attitude often got him in trouble at work."
    },
    {
        "word": "Fundamental",
        "definition": "adj. the most essential or most basic part",
        "exampleSentence": "A thesis is arguably the most fundamental part of an essay."
    },
    {
        "word": "Galvanizing",
        "definition": "adj. thrilling, exciting, stimulating",
        "exampleSentence": "The galvanizing performance left everyone spellbound."
    },
    {
        "word": "Geriatric",
        "definition": "adj. relating to old age",
        "exampleSentence": "I became interested in geriatric medicine shortly after my grandfather passed away from cancer."
    },
    {
        "word": "Hostile",
        "definition": "adj. harmful, dangerous",
        "exampleSentence": "The voices around the corner sounded angry, hostile even."
    },
    {
        "word": "Hypothetical",
        "definition": "adj. supposed; related to a hypothesis",
        "exampleSentence": "For my physics homework, I must come up with a hypothetical situation."
    },
    {
        "word": "Ignominious",
        "definition": "adj. publicly shameful or humiliating",
        "exampleSentence": "The politician's expensive campaign ultimately ended in ignominious defeat."
    },
    {
        "word": "Impart",
        "definition": "v. to transmit, bestow, or disclose",
        "exampleSentence": "Parents must impart common sense to their children."
    },
    {
        "word": "Impartiality",
        "definition": "n. the equal and objective treatment of opposing views",
        "exampleSentence": "To ensure impartiality, we require everyone to follow these general guidelines."
    },
    {
        "word": "Imposing",
        "definition": "adj. impressive (esp. in size or appearance)",
        "exampleSentence": "The old mansion was imposing in its huge size and gothic architecture."
    },
    {
        "word": "Imposition",
        "definition": "n. an unnecessary burden",
        "exampleSentence": "If it’s not too much of an imposition, could you proofread my paper?"
    },
    {
        "word": "Imprudent",
        "definition": "adj. not cautious or prudent; rash",
        "exampleSentence": "Backpacking abroad can be fun, but don’t be imprudent about money."
    },
    {
        "word": "Incite",
        "definition": "v. to encourage or stir up",
        "exampleSentence": "Her hateful words incited anger in the crowd."
    },
    {
        "word": "Indifference",
        "definition": "n. apathy, emotional detachment",
        "exampleSentence": "The girl’s indifference toward her brother upset their parents."
    },
    {
        "word": "Indiscriminately",
        "definition": "adv. randomly; with little or no distinction",
        "exampleSentence": "Lottery winners are chosen indiscriminately."
    },
    {
        "word": "Indulge",
        "definition": "v. to give into; to satisfy or gratify",
        "exampleSentence": "My friend loves to indulge in cheesy romance movies."
    },
    {
        "word": "Infer",
        "definition": "v. to guess, conclude, or derive by reasoning",
        "exampleSentence": "You can infer from this quotation that the writer didn’t care for “pretty” language."
    },
    {
        "word": "Innovative",
        "definition": "adj. novel or new (esp. as an idea or invention)",
        "exampleSentence": "Her invention was incredibly innovative and won her multiple awards."
    },
    {
        "word": "Insatiable",
        "definition": "adj. can’t be satisfied",
        "exampleSentence": "A vampire’s thirst for blood is said to be insatiable."
    },
    {
        "word": "Inversion",
        "definition": "n. a reversal",
        "exampleSentence": "The culture’s norms were an inversion of our own."
    },
    {
        "word": "Invoke",
        "definition": "v. to call on; to appeal to (e.g., a higher power)",
        "exampleSentence": "The shaman attempted to invoke a demon."
    },
    {
        "word": "Irreconcilable",
        "definition": "adj. incapable of being in harmony or agreed upon",
        "exampleSentence": "The couple’s differences were ultimately irreconcilable, giving them no choice but to break up."
    },
    {
        "word": "Lament",
        "definition": "v. to feel sorrow for; to mourn",
        "exampleSentence": "Susan lamented her missed chance at going to Europe with her high school class."
    },
    {
        "word": "Locomotion",
        "definition": "n. movement",
        "exampleSentence": "Physics involves the study of locomotion."
    },
    {
        "word": "Lucrative",
        "definition": "adj. capable of making a lot of money; profitable",
        "exampleSentence": "Writing books isn’t a particularly lucrative career, unless you’re J.K. Rowling."
    },
    {
        "word": "Malicious",
        "definition": "adj. harmful, spiteful",
        "exampleSentence": "The malicious spirit drove out the inhabitants from their home."
    },
    {
        "word": "Malleable",
        "definition": "adj. capable of being molded or changed",
        "exampleSentence": "Children’s minds are malleable but only for so long."
    },
    {
        "word": "Materialistic",
        "definition": "adj. superficial; focus on material possessions",
        "exampleSentence": "Many people accuse Americans of being materialistic."
    },
    {
        "word": "Melodramatic",
        "definition": "adj. extravagant or exaggerated (as of a melodrama)",
        "exampleSentence": "The melodramatic play was well liked by the audience."
    },
    {
        "word": "Modest",
        "definition": "adj. simple and humble\nadj. small in size or amount",
        "exampleSentence": "They moved into a modest house in the countryside.\nI received a modest sum of money for my help at the company event."
    },
    {
        "word": "Modify",
        "definition": "v. to change, alter, or tweak",
        "exampleSentence": "Dr. Nguyen modified the gene so that it wouldn’t carry the disease."
    },
    {
        "word": "Momentous",
        "definition": "adj. historically significant",
        "exampleSentence": "Her win in the election was momentous."
    },
    {
        "word": "Novel",
        "definition": "adj. new, innovative",
        "exampleSentence": "We are looking for novel ways to approach the project."
    },
    {
        "word": "Nuance",
        "definition": "n. a subtle difference in meaning",
        "exampleSentence": "Body-language experts even understand the nuances of facial expressions."
    },
    {
        "word": "Null",
        "definition": "adj. legally void and ineffective",
        "exampleSentence": "The government declared their marriage null."
    },
    {
        "word": "Objectivity",
        "definition": "n. judgment based on observations instead of emotions or opinions",
        "exampleSentence": "In scientific research, objectivity is of utmost importance."
    },
    {
        "word": "Obsolete",
        "definition": "adj. no longer used; rare or uncommon",
        "exampleSentence": "Historians assumed record players would be obsolete by now, but in fact they’re making a huge comeback."
    },
    {
        "word": "Omnipotent",
        "definition": "adj. almighty and all powerful",
        "exampleSentence": "Gods are omnipotent beings who can control human destiny."
    },
    {
        "word": "Onset",
        "definition": "n. the beginning or early stages",
        "exampleSentence": "At the onset of her career as a lawyer, things were looking up."
    },
    {
        "word": "Opine",
        "definition": "v. to openly express an opinion",
        "exampleSentence": "The new employee opined at the company meeting."
    },
    {
        "word": "Ornate",
        "definition": "adj. highly detailed and decorated",
        "exampleSentence": "That ornate silverware must be worth thousands of dollars!"
    },
    {
        "word": "Oust",
        "definition": "v. to remove or force out of (usu. a position or office)",
        "exampleSentence": "Sick and tired of putting up with his bad moods, the pirates ousted their captain."
    },
    {
        "word": "Paramount",
        "definition": "adj. predominant, superior, most important",
        "exampleSentence": "Our paramount concern is the safety of our employees."
    },
    {
        "word": "Peculiar",
        "definition": "adj. strange, bizarre",
        "exampleSentence": "Upon entering the abandoned house, Kate experienced a peculiar feeling, as if someone was watching her."
    },
    {
        "word": "Perish",
        "definition": "v. to die; to pass away",
        "exampleSentence": "According to the news, nobody perished in the fire."
    },
    {
        "word": "Persecute",
        "definition": "v. to cause suffering to",
        "exampleSentence": "They will persecute anyone who doesn’t agree with their views of the world."
    },
    {
        "word": "Petulant",
        "definition": "adj. cranky, pouty, irritable",
        "exampleSentence": "Petulant children are especially difficult to care for."
    },
    {
        "word": "Pinnacle",
        "definition": "n. highest level or degree",
        "exampleSentence": "Many believe that composers such as Beethoven and Mozart represent the pinnacle of classical music."
    },
    {
        "word": "Pitiable",
        "definition": "adj. deserving pity",
        "exampleSentence": "The frail-looking dog was pitiable, so I gave it some food and took it inside to care for it."
    },
    {
        "word": "Plausible",
        "definition": "adj. reasonable and possibly true",
        "exampleSentence": "Her story is plausible, but that doesn’t mean she’s telling the truth."
    },
    {
        "word": "Postulate",
        "definition": "v. to assert",
        "exampleSentence": "The literary critic postulates that romanticism and naturalism are actually interconnected."
    },
    {
        "word": "Potent",
        "definition": "adj. having great influence\nadj. having a strong, chemical effect",
        "exampleSentence": "The bald eagle is a potent symbol of the US.\nThe potion was definitely potent—it healed my wounds immediately!"
    },
    {
        "word": "Pragmatic",
        "definition": "adj. practical, useful",
        "exampleSentence": "It’s not necessarily more pragmatic to study engineering than it is to study philosophy."
    },
    {
        "word": "Precedent",
        "definition": "n. an example or subject from earlier in time",
        "exampleSentence": "This change in law is without historical precedent."
    },
    {
        "word": "Predecessor",
        "definition": "n.  someone who comes before you (usu. in position or office)",
        "exampleSentence": "My predecessor gave me many tips for running the office."
    },
    {
        "word": "Prescribe",
        "definition": "v. to command orders\nv. to issue authorization for medications",
        "exampleSentence": "The directions for our essay prescribe a length of at least ten pages.\nA doctor must prescribe you this medication before you can begin taking it."
    },
    {
        "word": "Principle",
        "definition": "n. basic truth, assumption, or rule",
        "exampleSentence": "Remember the universal principle: treat others as you want them to treat you."
    },
    {
        "word": "Prohibit",
        "definition": "v. to command against, to outlaw",
        "exampleSentence": "Alcohol was prohibited in the US in the 1920s."
    },
    {
        "word": "Prompt",
        "definition": "adj. punctual, on time\nn. a cue to begin something; instructions\nv. to incite, propel, or cause to act",
        "exampleSentence": "She is always prompt when it comes to turning in her homework.\nI had to write an essay based on a prompt.\nThe possibility of a scholarship prompted him to apply to Harvard."
    },
    {
        "word": "Promulgate",
        "definition": "v. to put into law or formally declare",
        "exampleSentence": "The ruler will at last promulgate an amnesty with the neighboring countries."
    },
    {
        "word": "Prosecute",
        "definition": "v. to bring criminal action against someone (in a trial)",
        "exampleSentence": "The suspect was prosecuted yesterday."
    },
    {
        "word": "Provocative",
        "definition": "adj. intending to provoke, inspire, or arouse",
        "exampleSentence": "Her nude paintings are considered quite provocative."
    },
    {
        "word": "Qualitative",
        "definition": "adj. involving qualities of something (features and content)",
        "exampleSentence": "I noticed a qualitative change in her paintings."
    },
    {
        "word": "Quantitative",
        "definition": "adj. involving quantities (numbers and amounts)",
        "exampleSentence": "We must conduct a quantitative analysis."
    },
    {
        "word": "Quirk",
        "definition": "n. a strange habit",
        "exampleSentence": "His biggest quirk is his love of old marbles."
    },
    {
        "word": "Ramify",
        "definition": "v. to split into two or more branches",
        "exampleSentence": "Cars ramified throughout the world in the twentieth century."
    },
    {
        "word": "Rash",
        "definition": "adj. without attention to danger or risk",
        "exampleSentence": "Her rash decision to pass the car nearly resulted in a crash."
    },
    {
        "word": "Raw",
        "definition": "adj. unrefined\nadj. not processed; uncooked (as in food)",
        "exampleSentence": "He’s got raw talent as a singer, but he needs to work on his performance skills.\nIn some countries, such as Japan, it is normal to eat raw fish."
    },
    {
        "word": "Readily",
        "definition": "adv. right away and without difficulty",
        "exampleSentence": "Water was readily available at different points in the race."
    },
    {
        "word": "Reconsideration",
        "definition": "n. thinking again about a previously made choice",
        "exampleSentence": "The judges’ reconsideration of her performance resulted in her victory."
    },
    {
        "word": "Reform",
        "definition": "n. a change for the better; improvement\nv. to improve via change",
        "exampleSentence": "The reform made it so that only those 18 and older can legally drive.\nThe government reformed its vague policies on marijuana use."
    },
    {
        "word": "Refute",
        "definition": "v. to prove to be untrue, unfounded, or incorrect",
        "exampleSentence": "The student refuted the professor’s claim in class."
    },
    {
        "word": "Reinforce",
        "definition": "v. to strengthen or add support to",
        "exampleSentence": "We can use these pipes to reinforce the structure."
    },
    {
        "word": "Reluctantly",
        "definition": "adv. somewhat unwillingly",
        "exampleSentence": "Max reluctantly agreed to see the horror movie with his friends."
    },
    {
        "word": "Renounce",
        "definition": "v. to give up (usu. power or a position)\nv. to cast off",
        "exampleSentence": "Our CEO renounced her position yesterday.\nHe renounced his friend after he caught her stealing money from him."
    },
    {
        "word": "Reproach",
        "definition": "v. to criticize",
        "exampleSentence": "The mother reproached her daughter’s school for making students come in during a blizzard."
    },
    {
        "word": "Repudiate",
        "definition": "v. to refuse to recognize as true\nv. to cast off",
        "exampleSentence": "The father repudiated his son’s marriage.\nShe repudiated her son once she found out he’d married someone without telling her."
    },
    {
        "word": "Retention",
        "definition": "n. the act of keeping something",
        "exampleSentence": "Water retention can make you weigh more on certain days."
    },
    {
        "word": "Satiated",
        "definition": "adj. satisfied (usu. in hunger)",
        "exampleSentence": "I felt satiated after eating a snack."
    },
    {
        "word": "Savvy",
        "definition": "adj. having practical intelligence or knowledge",
        "exampleSentence": "My brother is not very savvy when it comes to using public transportation."
    },
    {
        "word": "Scandalous",
        "definition": "adj. morally offensive, often causing damage to one’s reputation",
        "exampleSentence": "The scandalous politician decided it was best to resign from office."
    },
    {
        "word": "Scorn",
        "definition": "v. to look down on with disdain",
        "exampleSentence": "It’s difficult for me not to scorn those who use improper grammar."
    },
    {
        "word": "Scrupulous",
        "definition": "adj. paying great attention to detail",
        "exampleSentence": "I am a scrupulous proofreader and never miss an error."
    },
    {
        "word": "Scrutinize",
        "definition": "v. to examine carefully and critically",
        "exampleSentence": "The teacher scrutinized her students’ essays."
    },
    {
        "word": "Secrete",
        "definition": "v. to produce or release (a substance)",
        "exampleSentence": "Trees secrete a sticky substance called sap."
    },
    {
        "word": "Sentiment",
        "definition": "n. opinion\nn. a tender or moving gesture",
        "exampleSentence": "I am of the sentiment that you should never give out your passwords to anyone.\nEven though I’m not a big fan of porcelain dolls, I appreciated the sentiment."
    },
    {
        "word": "Sheer",
        "definition": "adj. so thin that light can shine through",
        "exampleSentence": "The curtains on the window were so sheer you could clearly see inside the house."
    },
    {
        "word": "Simple",
        "definition": "adj. easy; not complex\nadj. undecorated",
        "exampleSentence": "This math problem is so simple even a first grader can solve it.\nThe simple beauty of the ocean is what makes it memorable."
    },
    {
        "word": "Sinister",
        "definition": "adj. ominous, evil",
        "exampleSentence": "Medieval peasants believed sinister demons could harm humans."
    },
    {
        "word": "Solidarity",
        "definition": "n. the joining of commonalities or common purposes among a group",
        "exampleSentence": "I stood in solidarity with other female students by refusing to wear the school’s sexist uniform."
    },
    {
        "word": "Sparingly",
        "definition": "adv. insufficiently, meagerly, or in a restricted manner",
        "exampleSentence": "Due to my condition, I must eat salt sparingly."
    },
    {
        "word": "Spawn",
        "definition": "v. to release eggs\nv. to call forth or generate",
        "exampleSentence": "Frogs typically spawn in ponds.\nThe topic spawned an ongoing debate among his family members."
    },
    {
        "word": "Spur",
        "definition": "v. to stimulate or incite",
        "exampleSentence": "Her bravery spurred others to act."
    },
    {
        "word": "Squalid",
        "definition": "adj. run-down, sordid, or sleazy",
        "exampleSentence": "The squalid cabin needed a new roof and an exterminator."
    },
    {
        "word": "Stark",
        "definition": "adj. very plain; devoid of any details or features",
        "exampleSentence": "Looking out at the stark landscape, I felt a keen sense of isolation."
    },
    {
        "word": "Static",
        "definition": "adj. motionless\nadj. changeless",
        "exampleSentence": "The ball is static.\nHer life has been static for the past three years."
    },
    {
        "word": "Subordinate",
        "definition": "adj. lower in rank\nn. someone lower in rank\nv. to make dependent on or put at a lower rank",
        "exampleSentence": "The subordinate officers work every day.\nMy subordinate will check you in.\nYou aren’t my boss—you can’t subordinate me to the role of receptionist!"
    },
    {
        "word": "Subsequently",
        "definition": "adv. happening later or after something",
        "exampleSentence": "I subsequently went home."
    },
    {
        "word": "Substantial",
        "definition": "adj. very large in amount or degree",
        "exampleSentence": "I was shocked to find a substantial amount of money beneath the park bench."
    },
    {
        "word": "Substantiate",
        "definition": "v. to strengthen with new evidence or facts",
        "exampleSentence": "It is important for scientists to substantiate their theories whenever possible."
    },
    {
        "word": "Subtle",
        "definition": "adj. hard to detect or analyze",
        "exampleSentence": "I detected in her expression a subtle hint of irritation."
    },
    {
        "word": "Sufficient",
        "definition": "adj. enough; just meeting a requirement",
        "exampleSentence": "These boxes should be sufficient for our move."
    },
    {
        "word": "Surly",
        "definition": "adj. unfriendly; inclined to anger",
        "exampleSentence": "The bartender was a surly fellow who wasn’t afraid to start a fight."
    },
    {
        "word": "Surmount",
        "definition": "v. to get on top of or overcome",
        "exampleSentence": "They managed to surmount the language barrier by using a translation app."
    },
    {
        "word": "Susceptible",
        "definition": "adj. to be vulnerable (to something)",
        "exampleSentence": "Children are more susceptible to certain illnesses than adults are."
    },
    {
        "word": "Tactful",
        "definition": "adj. skilled at dealing with people",
        "exampleSentence": "Her tactful attitude toward our class made her one of my favorite teachers."
    },
    {
        "word": "Taut",
        "definition": "adj. pulled tight",
        "exampleSentence": "The rubberband was taut and ready to be fired."
    },
    {
        "word": "Teeming",
        "definition": "adj. abundantly filled (usu. with living organisms)",
        "exampleSentence": "Doorknobs are not as clean as they look and are often teeming with germs."
    },
    {
        "word": "Temperament",
        "definition": "n. usual mood or feelings",
        "exampleSentence": "She had a hostile temperament, making her intimidating to most people."
    },
    {
        "word": "Tentative",
        "definition": "adj. not yet finalized",
        "exampleSentence": "We haven’t made any official arrangements yet, but the tentative location for our wedding is Hawaii."
    },
    {
        "word": "Transparent",
        "definition": "adj. see-through; so thin that light can shine through\nadj. truthful or easy to perceive",
        "exampleSentence": "Stained window glass isn’t as transparent as regular window glass is.\nShe was transparent about her plans to end her marriage."
    },
    {
        "word": "Treacherous",
        "definition": "adj. dangerous and unstable",
        "exampleSentence": "The journey was becoming treacherous, but they continued on regardless."
    },
    {
        "word": "Tremendous",
        "definition": "adj. very large, good, or bad in degree or size",
        "exampleSentence": "Tremendous news! You don’t have to repay your loans!"
    },
    {
        "word": "Ubiquitous",
        "definition": "adj. being everywhere at once",
        "exampleSentence": "Cell phones are ubiquitous these days."
    },
    {
        "word": "Unadorned",
        "definition": "adj. undecorated, plain",
        "exampleSentence": "Though the dress was cheap and unadorned, it was by far her favorite one on the rack."
    },
    {
        "word": "Undermine",
        "definition": "v. to weaken or subvert (usu. gradually or secretly)",
        "exampleSentence": "Parents should take care not to constantly undermine their children."
    },
    {
        "word": "Underscore",
        "definition": "v. to emphasize or give additional weight to",
        "exampleSentence": "This sentence seems to underscore the overall meaning of the passage."
    },
    {
        "word": "Undulate",
        "definition": "v. to move as ripples or in a wavy pattern",
        "exampleSentence": "Belly dancers are known for their ability to skillfully undulate their stomachs."
    },
    {
        "word": "Unilateral",
        "definition": "adj. one-sided",
        "exampleSentence": "The unilateral decision was deemed unfair by the other party involved."
    },
    {
        "word": "Unjust",
        "definition": "adj. unfair; not justified",
        "exampleSentence": "The court’s decision is unjust—he should not go free."
    },
    {
        "word": "Unmitigated",
        "definition": "adj. downright, utter, total",
        "exampleSentence": "My speech was an unmitigated disaster!"
    },
    {
        "word": "Unprecedented",
        "definition": "adj. completely new and never having happened before; historic",
        "exampleSentence": "The number of protestors was unprecedented."
    },
    {
        "word": "Unveil",
        "definition": "v. to make visible; to reveal",
        "exampleSentence": "We plan to unveil our plans for the new company project on Sunday."
    },
    {
        "word": "Urge",
        "definition": "n. desire or impulse\nv. to encourage or persuade",
        "exampleSentence": "He had the urge to tell his parents about his acceptance to Columbia but decided against it.\nShe urged her sister to apply to Stanford."
    },
    {
        "word": "Validate",
        "definition": "v. to prove or declare valid",
        "exampleSentence": "Your selfish actions do not validate your feelings for me."
    },
    {
        "word": "Viability",
        "definition": "n. ability to be done in a practical or useful way",
        "exampleSentence": "The viability of the solution is questionable."
    },
    {
        "word": "Vital",
        "definition": "adj. urgently necessary",
        "exampleSentence": "It is vital that you respond by the deadline."
    },
    {
        "word": "Vow",
        "definition": "v. to promise",
        "exampleSentence": "My brother quickly broke his vow to never eat chocolate again."
    },
    {
        "word": "Warrant",
        "definition": "v. to prove to be reasonable",
        "exampleSentence": "Wanting to look cool in front of your friends doesn’t warrant breaking the law."
    },
    {
        "word": "Yield",
        "definition": "n. production of an amount\nv. to give way to or surrender to\nv. to produce or supply",
        "exampleSentence": "The farmer’s annual pumpkin yield exceeded 10,000.\nCars turning right on red must yield to oncoming traffic.\nOur experiment yielded many unique-looking vegetables."
    }
]














const prompts = [
    [
        "You’re taking a test and don’t understand anything. Describe the situation.",
        "You get your results and you got 50%. Describe the moment you find out and your reaction.",
        "You hear the footsteps of your parents approaching your room. Describe the situation and how you are going to tell your parents."
    ],
    [
        "A kid stole your lunch money and now you’re in a fist fight. Describe the situation and what you do.",
        "A crowd forms around you and a friend tells you to stop. Describe the situation and your reaction.",
        "You get called down to the principal's office. Describe the situation and what you do to defend yourself.",
    ],
    [
        "You lose an arm wrestling match that you’d promised you’d win. Describe the situation and how you feel.",
        "Turns out you bet $500 on this match so you owe your opponent $500. Describe the situation and what you do.",
        "Your parents find out. Describe the situation and how you defend yourself?"
    ],
    [
        "You stain your sister’s favorite sweater. Describe the situation and how you hide it.",
        "Your sister finds it. Describe the situation and your excuse?",
        "Your sister sees through your lie. Describe the situation and how you apologize."
    ],
    [
        "You see your friends hanging out without you on social media, Describe the situation and how you feel.",
        "You decide to text one of them and they lie saying they asked you. Describe the situation and your response.",
        "Your friends come clean and say they forgot to invite you and apologize. Describe the situation and if you forgive them."
    ],
    [
        "You're at the park and see a kid push someone so you decide to go talk to them. Describe the situation and what you say.",
        "The kid starts crying and runs to his mom. Describe the situation and what you do.",
        "The mom comes back and is mad at you for yelling at her child. Describe the situation and your response."
    ],
    [
        "The assignment worth 30% of your grade was due today, but you forgot. Describe the situation and what you do.",
        "You walk into class and decide to ask for an extension. Describe the situation and what you say.",
        "Your teacher says it’s your fault that you forgot and gives you a zero. Describe the situation and how you feel."
    ]
]

const games = { 
    // 20:{
    //     status:'waiting',
    //     players:{
    //         player1:{ //determine player by looking at number length of players keys
    //             fullStory:[], //have sets of objects. Prompt, then story
    //             prompt:"Imagine you're eating poo. Describe the situation",
    //             story:"I went to the station and there was this strange commotion. I wasn't sure why, but I decided to",
    //             ready:true
    //         },
    //         player2:{
    //             fullStory:[],
    //             prompt:"You open the door and you're being robbed. What do you do?",
    //             story:"so like you suck",
    //             ready:true
    //         }
    //     },
    //     clients:[]
    // }
}



// const community_prompts = [
//     ['a','b','c'],
//     ['a1','b1','c1'],
// ]




// app.use((request,response,next)=>{
//     console.log(games);
//     next();
// })


        
    

    


const fileName = 'community_prompts.txt';
let community_prompts = JSON.parse(fs.readFileSync(fileName));
const clients = [];


app.get('/vocab',(request,response)=>{
    let wordObject = satWords[Math.floor(Math.random()*satWords.length)];
    response.send(JSON.stringify(wordObject));
})




app.get('/random',(request,response)=>{
    let i=0;
    let set = [];
    while (i<3){
        let num = Math.floor(Math.random()*prompts.length);
        let num2 = Math.floor(Math.random()*3);
        let thing = prompts[num][num2];
        if (!set.includes(thing)){
            set.push(thing);
            i++;
        }
    }
    response.send(set);
})


app.get('/make-game',(request,response)=>{
    let num = Math.floor(Math.random()*10000); //change digit num
    games[num] = {
        status:'waiting',
        players:{
            player1:{
                fullStory:[],
                prompt:null,
                story:null,
                status:false
            }
        },
        clients:[]
    }
    response.send(JSON.stringify(num));
    // console.log(games);
})

app.get("/join/:pin",(request,response)=>{
    let pin = request.params.pin;
    if (games[pin] === undefined){
        response.send(false);
        return;
    } //otherwise...
    response.send(true);
})


app.post('/player-count/:pin',(request,response)=>{
    let game = games[pin];
    let num = Object.keys(game.players.length)+1;
    let name = "player"+num;
    game.players[name] = {
        fullStory:[],
        prompt:null,
        story:null,
        ready:false
    }
    setTimeout(send(),0);  // abuses setTimeout to call sendClicks after this function ends
    response.end();
})



app.get('/player-count/:pin',(request,response)=>{
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
    clients.push(response);
    let pin = request.params.pin;

    console.log(clients.length);
    console.log(games);
    sendPlayerCount(pin);
    request.on('close', closeConnection);
    function closeConnection() {
        clients.splice(clients.indexOf(response), 1);  // remove this client from the clients list
        console.log('connection closed');
    }
})


function sendPlayerCount(pin){
    let playerCount = Object.keys(games[pin].players).length;
    let stringCount = JSON.stringify(playerCount);
    let game = games[pin];
    for (let client of game.clients){
        client.write('event:playerCount\n');
        client.write('data:${stringCount}\n\n');
    }
}



function send(){
    let numGames = JSON.stringify({size:Object.keys(games).length});
    for (let client of clients){
        client.write('event:playerCount\n');
        client.write('data:'+numGames+'\n\n');
    }
}



app.post('/ready/:pin',(request,response)=>{

})


app.get("/",(request,response)=>{
    let data = prompts[Math.floor(Math.random()*prompts.length)];
    response.send(data);
})

app.get('/community',(request,response)=>{
    let data = community_prompts[Math.floor(Math.random()*community_prompts.length)];
    response.send(data);
})

app.post('/community/:formData',(request,response)=>{
    let data = request.params.formData;
    data = JSON.parse(data);
    community_prompts.push(data);
    // console.log(data);
    // console.log(community_prompts);
    fs.writeFileSync(fileName,JSON.stringify(community_prompts));

}); 



app.listen(port);

