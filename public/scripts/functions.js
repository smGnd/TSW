var kartyPostaci = [];
var kartyDzielnic = [];
var liczbaWybudowanychDzielnic = 0;

function postac (numer, nazwa){
	this.numer = numer;
	this.nazwa = nazwa;
}

function dzielnica (nazwa, koszt, kolor){
	this.nazwa = nazwa;
	this.koszt = koszt;
	this.kolor = kolor;
}
//tworzenie postaci
kartyPostaci[0] = new postac(1, "Zabójca");
kartyPostaci[1] = new postac(2, "Złodziej");
kartyPostaci[2] = new postac(3, "Magik");
kartyPostaci[3] = new postac(4, "Król");
kartyPostaci[4] = new postac(5, "Biskup");
kartyPostaci[5] = new postac(6, "Kupiec");
kartyPostaci[6] = new postac(7, "Architekt");
kartyPostaci[7] = new postac(8, "Generał");

//tworzenie dzielnic
kartyDzielnic[0] = new dzielnica("Chrzcielnica", 1, "niebieski");
kartyDzielnic[1] = new dzielnica("Kościół", 3, "niebieski");
kartyDzielnic[2] = new dzielnica("Katedra", 5, "niebieski");

kartyDzielnic[3] = new dzielnica("Latarnia morska", 1, "fioletowy");
kartyDzielnic[4] = new dzielnica("Szpital", 3, "fioletowy");
kartyDzielnic[5] = new dzielnica("Obserwatorium", 5, "fioletowy");

kartyDzielnic[6] = new dzielnica("Dwór", 1, "złoty");
kartyDzielnic[7] = new dzielnica("Pałac", 3, "złoty");
kartyDzielnic[8] = new dzielnica("Zamek", 5, "złoty");

kartyDzielnic[9] = new dzielnica("Targowisko", 1, "zielony");
kartyDzielnic[10] = new dzielnica("Tawerna", 3, "zielony");
kartyDzielnic[11] = new dzielnica("Ratusz", 5, "zielony");

kartyDzielnic[12] = new dzielnica("Zbrojownia", 1, "czerwony");
kartyDzielnic[13] = new dzielnica("Strażnica", 3, "czerwony");
kartyDzielnic[14] = new dzielnica("Forteca", 5, "czerwony");

