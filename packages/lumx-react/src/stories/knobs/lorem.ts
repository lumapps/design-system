const shortText = `
Nihil hic munitissimus habendi senatus locus, nihil horum? At nos hinc posthac, sitientis piros
Afros. Magna pars studiorum, prodita quaerimus. Integer legentibus erat a ante historiarum
dapibus. Praeterea iter est quasdam res quas ex communi. Ullamco laboris nisi ut aliquid ex ea
commodi consequat. Inmensae subtilitatis, obscuris et malesuada fames. Me non paenitet nullum
festiviorem excogitasse ad hoc. Cum ceteris in veneratione tui montes, nascetur mus. Etiam
habebis sem dicantur magna mollis euismod. Quis aute iure reprehenderit in voluptate velit esse.
Phasellus laoreet lorem vel dolor tempus vehicula. Ambitioni dedisse scripsisse iudicaretur.
Paullum deliquit, ponderibus modulisque suis ratio utitur. Ab illo tempore, ab est sed
immemorabili. Nec dubitamus multa iter quae et nos invenerat. Tu quoque, Brute, fili mi, nihil
timor populi, nihil! Morbi fringilla convallis sapien, id pulvinar odio volutpat. Cras mattis
iudicium purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
Quisque ut dolor gravida, placerat libero vel, euismod. Unam incolunt Belgae, aliam Aquitani,
tertiam. Cras mattis iudicium purus sit amet fermentum`;
const longText = `
${shortText}. Prima luce, cum quibus mons aliud
consensu ab eo. Vivamus sagittis lacus vel augue laoreet rutrum faucibus. Petierunt uti sibi
concilium totius Galliae in diem certam indicere. Etiam habebis sem dicantur magna mollis
euismod. A communi observantia non est recedendum. Ut enim ad minim veniam, quis nostrud
exercitation. Paullum deliquit, ponderibus modulisque suis ratio utitur. Hi omnes lingua,
institutis, legibus inter se differunt. Magna pars studiorum, prodita quaerimus. Quisque ut
dolor gravida, placerat libero vel, euismod. Tityre, tu patulae recubans sub tegmine fagi dolor.
Excepteur sint obcaecat cupiditat non proident culpa. Plura mihi bona sunt, inclinet, amari
petere vellent. Quae vero auctorem tractata ab fiducia dicuntur. Inmensae subtilitatis, obscuris
et malesuada fames. Quo usque tandem abutere, Catilina, patientia nostra? Nihilne te nocturnum
praesidium Palati, nihil urbis vigiliae. Curabitur blandit tempus ardua ridiculus sed magna. Tu
quoque, Brute, fili mi, nihil timor populi, nihil! Nihil hic munitissimus habendi senatus locus,
nihil horum?Tu quoque, Brute, fili mi, nihil timor populi, nihil! Tityre, tu patulae recubans
sub tegmine fagi dolor. Plura mihi bona sunt, inclinet, amari petere vellent. Ullamco laboris
nisi ut aliquid ex ea commodi consequat. Pellentesque habitant morbi tristique senectus et
netus. Salutantibus vitae elit libero, a pharetra augue. Lorem ipsum dolor sit amet, consectetur
adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Petierunt uti sibi
concilium totius Galliae in diem certam indicere. Contra legem facit qui id facit quod lex
prohibet. Integer legentibus erat a ante historiarum dapibus. Petierunt uti sibi concilium
totius Galliae in diem certam indicere. Ab illo tempore, ab est sed immemorabili. Nihil hic
munitissimus habendi senatus locus, nihil horum? Quisque ut dolor gravida, placerat libero vel,
euismod. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut
labore et dolore magna aliqua. Nec dubitamus multa iter quae et nos invenerat. Quam temere in
vitiis, legem sancimus haerentia. Donec sed odio operae, eu vulputate felis rhoncus. Idque
Caesaris facere voluntate liceret: sese habere. Paullum deliquit, ponderibus modulisque suis
ratio utitur. Quae vero auctorem tractata ab fiducia dicuntur. Gallia est omnis divisa in partes
tres, quarum. Etiam habebis sem dicantur magna mollis euismod. Fabio vel iudice vincam, sunt in
culpa qui officia. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor
incidunt ut labore et dolore magna aliqua. Tu quoque, Brute, fili mi, nihil timor populi, nihil!
Integer legentibus erat a ante historiarum dapibus. Tityre, tu patulae recubans sub tegmine fagi
dolor. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Idque Caesaris facere voluntate
liceret: sese habere. Quid securi etiam tamquam eu fugiat nulla pariatur. Pellentesque habitant
morbi tristique senectus et netus. Ut enim ad minim veniam, quis nostrud exercitation. Petierunt
uti sibi concilium totius Galliae in diem certam indicere. Curabitur est gravida et libero vitae
dictum. Qui ipsorum lingua Celtae, nostra Galli appellantur. Quam temere in vitiis, legem
sancimus haerentia. Phasellus laoreet lorem vel dolor tempus vehicula. Ab illo tempore, ab est
sed immemorabili. Praeterea iter est quasdam res quas ex communi. Quo usque tandem abutere,
Catilina, patientia nostra? Non equidem invideo, miror magis posuere velit aliquet. Excepteur
sint obcaecat cupiditat non proident culpa. Curabitur blandit tempus ardua ridiculus sed magna.
Plura mihi bona sunt, inclinet, amari petere vellent. Quae vero auctorem tractata ab fiducia
dicuntur. Me non paenitet nullum festiviorem excogitasse ad hoc. Unam incolunt Belgae, aliam
Aquitani, tertiam.`;

export const loremIpsum = (type: 'short' | 'long'): string => (type === 'short' ? shortText : longText);
