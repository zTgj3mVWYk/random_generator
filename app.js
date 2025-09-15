// Główne funkcje aplikacji
class DerangementGenerator {
    constructor() {
        this.generateBtn = document.getElementById('generateBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.attemptsCount = document.getElementById('attemptsCount');
        this.btnText = document.querySelector('.btn-text');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        
        this.init();
    }

    init() {
        this.generateBtn.addEventListener('click', () => {
            this.generateDerangement();
        });
    }

    // Funkcja Fisher-Yates shuffle
    fisherYatesShuffle(arr) {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    // Sprawdzenie czy tablica jest derangement (brak fixed points)
    isDerangement(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === i) {
                return false;
            }
        }
        return true;
    }

    // Główna funkcja generowania derangement
    generateDerangement() {
        this.showLoading();
        
        // Użyj setTimeout zamiast async/await dla lepszej kompatybilności
        setTimeout(() => {
            let attempts = 0;
            let result;
            const baseArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

            // Retry loop - generuj dopóki nie znajdziesz derangement
            do {
                attempts++;
                result = this.fisherYatesShuffle(baseArray);
            } while (!this.isDerangement(result));

            // Wyświetl wyniki
            this.displayResults(result, attempts);
            this.hideLoading();
        }, 800); // Dłuższe opóźnienie dla efektu wizualnego
    }

    // Wyświetlenie wyników w pionowej tabeli
    displayResults(sequence, attempts) {
        // Pokaż sekcję wyników natychmiast
        this.resultsSection.classList.remove('hidden');
        
        // Wyczyść poprzednie style i wartości
        const valueCells = document.querySelectorAll('.value-cell');
        const tableRows = document.querySelectorAll('.vertical-table tbody tr');
        
        valueCells.forEach(cell => {
            cell.classList.remove('animate', 'valid', 'fixed-point');
            cell.textContent = '';
        });

        tableRows.forEach(row => {
            row.classList.remove('highlight');
        });

        // Wypełnij komórki wartościami w pionowym układzie
        sequence.forEach((value, index) => {
            const cell = document.getElementById(`val-${index}`);
            const row = document.querySelector(`tr[data-index="${index}"]`);
            
            if (cell && row) {
                cell.textContent = value;
                cell.classList.add('valid');
                
                // Sprawdź czy to fixed point (nie powinno się zdarzyć w derangement)
                if (value === index) {
                    cell.classList.add('fixed-point');
                    cell.classList.remove('valid');
                }
            }
        });

        // Dodaj animację stopniowo dla każdego wiersza
        let animationDelay = 0;
        sequence.forEach((value, index) => {
            setTimeout(() => {
                const cell = document.getElementById(`val-${index}`);
                const row = document.querySelector(`tr[data-index="${index}"]`);
                
                if (cell && row) {
                    // Animacja komórki z wartością
                    cell.classList.add('animate');
                    
                    // Dodaj subtle highlight do całego wiersza
                    row.style.transform = 'scale(1.02)';
                    row.style.boxShadow = '0 2px 8px rgba(var(--color-success-rgb), 0.2)';
                    
                    setTimeout(() => {
                        cell.classList.remove('animate');
                        row.style.transform = '';
                        row.style.boxShadow = '';
                    }, 400);
                }
            }, animationDelay);
            animationDelay += 120; // Nieco dłuższe opóźnienie dla pionowego układu
        });

        // Wyświetl liczbę prób
        this.attemptsCount.textContent = attempts;

        // Zapisz do historii
        if (window.derangementApp && window.derangementApp.advanced) {
            window.derangementApp.advanced.addToHistory(sequence, attempts);
        }

        // Scroll do wyników po krótkiej przerwie
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 500);
    }

    // Pokaż animację ładowania
    showLoading() {
        this.generateBtn.classList.add('generating');
        this.generateBtn.disabled = true;
        this.btnText.style.opacity = '0';
        this.loadingSpinner.classList.remove('hidden');
    }

    // Ukryj animację ładowania
    hideLoading() {
        this.generateBtn.classList.remove('generating');
        this.generateBtn.disabled = false;
        this.btnText.style.opacity = '1';
        this.loadingSpinner.classList.add('hidden');
    }

    // Funkcja sprawdzająca walidność
    validateSequence(sequence) {
        return {
            noRepeats: this.checkNoRepeats(sequence),
            noFixedPoints: this.isDerangement(sequence)
        };
    }

    // Sprawdzenie braku powtórzeń
    checkNoRepeats(arr) {
        const seen = new Set();
        for (let num of arr) {
            if (seen.has(num)) {
                return false;
            }
            seen.add(num);
        }
        return arr.length === 10 && 
               arr.every(num => num >= 0 && num <= 9);
    }
}

// Funkcje pomocnicze i dodatkowe funkcjonalności
class Utils {
    // Funkcja do wyświetlania przykładów
    static showExample() {
        console.log('Przykład poprawnego derangement: [2, 3, 1, 0, 6, 8, 4, 9, 5, 7]');
        console.log('Sprawdzenie (pionowy układ):');
        const example = [2, 3, 1, 0, 6, 8, 4, 9, 5, 7];
        console.log('| Indeks | Wartość | Status |');
        console.log('|--------|---------|---------|');
        example.forEach((value, index) => {
            const status = value !== index ? '✓ OK' : '✗ Fixed point';
            console.log(`|   ${index}    |    ${value}    | ${status} |`);
        });
    }

    // Statystyki prawdopodobieństwa
    static calculateProbability() {
        // Przybliżona liczba derangement dla n=10
        // Dokładna wartość: 1334961
        const derangements = 1334961;
        const totalPermutations = 3628800; // 10!
        const probability = derangements / totalPermutations;
        
        console.log(`Prawdopodobieństwo derangement dla n=10: ${(probability * 100).toFixed(2)}%`);
        console.log(`Średnia liczba prób: ${(1/probability).toFixed(1)}`);
        
        return { 
            derangements, 
            totalPermutations,
            probability, 
            expectedAttempts: 1/probability 
        };
    }

    // Funkcja do wyświetlania pionowego układu w konsoli
    static showVerticalLayout(sequence) {
        if (!sequence || sequence.length !== 10) {
            console.log('Podaj prawidłową sekwencję 10 liczb.');
            return;
        }
        
        console.log('Pionowy układ tabeli:');
        console.log('┌────────┬─────────┐');
        console.log('│ Indeks │ Wartość │');
        console.log('├────────┼─────────┤');
        
        sequence.forEach((value, index) => {
            console.log(`│   ${index}    │    ${value}    │`);
        });
        
        console.log('└────────┴─────────┘');
    }
}

// Historia i statystyki
class AdvancedFeatures {
    constructor() {
        this.history = [];
        this.maxHistory = 10;
    }

    // Dodanie do historii
    addToHistory(sequence, attempts) {
        const entry = {
            sequence: [...sequence],
            attempts: attempts,
            timestamp: new Date().toLocaleTimeString('pl-PL')
        };
        
        this.history.unshift(entry);
        if (this.history.length > this.maxHistory) {
            this.history.pop();
        }
        
        console.log(`Nowe generowanie: [${sequence.join(', ')}] (${attempts} prób)`);
        
        // Pokaż pionowy układ w konsoli
        if (window.derangementApp && window.derangementApp.utils) {
            window.derangementApp.utils.showVerticalLayout(sequence);
        }
    }

    // Wyświetlenie historii w konsoli
    showHistory() {
        if (this.history.length === 0) {
            console.log('Brak historii generowań.');
            return;
        }
        
        console.log('Historia ostatnich generowań (pionowy układ):');
        this.history.forEach((entry, index) => {
            console.log(`\n${index + 1}. ${entry.timestamp} - ${entry.attempts} prób:`);
            console.log('┌────────┬─────────┐');
            console.log('│ Indeks │ Wartość │');
            console.log('├────────┼─────────┤');
            entry.sequence.forEach((value, idx) => {
                console.log(`│   ${idx}    │    ${value}    │`);
            });
            console.log('└────────┴─────────┘');
        });
    }

    // Analiza statystyczna
    getStatistics() {
        if (this.history.length === 0) {
            console.log('Brak danych do analizy.');
            return null;
        }
        
        const attempts = this.history.map(h => h.attempts);
        const average = attempts.reduce((a, b) => a + b, 0) / attempts.length;
        const min = Math.min(...attempts);
        const max = Math.max(...attempts);
        
        const stats = {
            totalGenerations: this.history.length,
            averageAttempts: parseFloat(average.toFixed(1)),
            minAttempts: min,
            maxAttempts: max
        };
        
        console.log('Statystyki (pionowy układ tabeli):', stats);
        return stats;
    }

    // Sprawdzenie czy wszystkie generowania są poprawne
    validateHistory() {
        const generator = new DerangementGenerator();
        let allValid = true;
        
        this.history.forEach((entry, index) => {
            const validation = generator.validateSequence(entry.sequence);
            if (!validation.noRepeats || !validation.noFixedPoints) {
                console.error(`Błąd w generowaniu ${index + 1}:`, entry.sequence);
                allValid = false;
            }
        });
        
        if (allValid) {
            console.log('Wszystkie generowania w historii są poprawne! ✓');
        }
        
        return allValid;
    }

    // Eksportuj ostatni wynik jako pionową tabelę
    exportLastResult() {
        if (this.history.length === 0) {
            console.log('Brak wyników do eksportu.');
            return null;
        }
        
        const lastResult = this.history[0];
        const verticalTable = {
            timestamp: lastResult.timestamp,
            attempts: lastResult.attempts,
            pairs: lastResult.sequence.map((value, index) => ({
                indeks: index,
                wartosc: value
            }))
        };
        
        console.log('Eksport ostatniego wyniku:');
        console.log(JSON.stringify(verticalTable, null, 2));
        return verticalTable;
    }
}

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎲 Inicjalizacja aplikacji (wersja pionowa)...');
    
    // Sprawdź czy wszystkie elementy DOM są dostępne
    const elementsToCheck = [
        'generateBtn',
        'resultsSection', 
        'attemptsCount'
    ];
    
    let allElementsFound = true;
    elementsToCheck.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element o ID '${id}' nie został znaleziony!`);
            allElementsFound = false;
        }
    });
    
    if (!allElementsFound) {
        console.error('Nie wszystkie elementy DOM zostały znalezione!');
        return;
    }
    
    // Główny generator
    const generator = new DerangementGenerator();
    
    // Zaawansowane funkcjonalności
    const advanced = new AdvancedFeatures();
    
    // Dodaj do globalnego obiektu window
    window.derangementApp = {
        generator,
        advanced,
        utils: Utils
    };
    
    // Informacje w konsoli
    console.log('✅ Generator liczb bez fixed points załadowany (układ pionowy)!');
    console.log('📋 Dostępne funkcje w konsoli:');
    console.log('  • window.derangementApp.utils.showExample() - pokaż przykład');
    console.log('  • window.derangementApp.utils.calculateProbability() - oblicz prawdopodobieństwo');
    console.log('  • window.derangementApp.utils.showVerticalLayout([1,2,3...]) - pokaż pionowy układ');
    console.log('  • window.derangementApp.advanced.showHistory() - pokaż historię');
    console.log('  • window.derangementApp.advanced.getStatistics() - pokaż statystyki');
    console.log('  • window.derangementApp.advanced.validateHistory() - sprawdź historię');
    console.log('  • window.derangementApp.advanced.exportLastResult() - eksportuj ostatni wynik');
});