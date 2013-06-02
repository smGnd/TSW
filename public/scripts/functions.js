var kartyDzielnic = [];
var liczbaWybudowanychDzielnic = 0;

function dzielnica (nazwa, koszt, kolor){
	this.nazwa = nazwa;
	this.koszt = koszt;
	this.kolor = kolor;
}

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
