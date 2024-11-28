let array = [];
let sorting = false;
let comparisons = 0;
let swaps = 0;

function updateArraySize(size) {
    document.getElementById('arraySizeValue').textContent = size;
    generateArray(parseInt(size));
}

function generateArray(size = 50) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    renderArray();
    resetStats();
}

function renderArray() {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    const barWidth = (container.clientWidth - (array.length * 2)) / array.length;
    
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.style.height = `${value}%`;
        bar.style.width = `${barWidth}px`;
        bar.classList.add('bar');
        container.appendChild(bar);
    });
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    updateStats();
}

function updateStats() {
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
}

function startSorting(algorithm) {
    if (sorting) return;
    sorting = true;
    resetStats();
    
    switch (algorithm) {
        case 'bubble':
            bubbleSort();
            break;
        case 'quick':
            quickSort(0, array.length - 1);
            break;
        case 'merge':
            mergeSort(0, array.length - 1);
            break;
    }
}

function stopSorting() {
    sorting = false;
}

function resetArray() {
    sorting = false;
    setTimeout(() => {
        const bars = document.getElementsByClassName('bar');
        Array.from(bars).forEach(bar => {
            bar.style.backgroundColor = 'var(--primary-color)';
        });
        const size = document.getElementById('arraySize').value;
        generateArray(parseInt(size));
    }, 100);
}

async function bubbleSort() {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length && sorting; i++) {
        for (let j = 0; j < array.length - i - 1 && sorting; j++) {
            comparisons++;
            updateStats();
            bars[j].style.backgroundColor = 'red';
            bars[j + 1].style.backgroundColor = 'red';

            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
                renderArray();
            }

            bars[j].style.backgroundColor = 'var(--primary-color)';
            bars[j + 1].style.backgroundColor = 'var(--primary-color)';
        }
        if (sorting) {
            bars[array.length - i - 1].style.backgroundColor = 'green';
        }
    }
}

async function swap(i, j) {
    return new Promise(resolve => {
        setTimeout(() => {
            [array[i], array[j]] = [array[j], array[i]];
            swaps++;
            updateStats();
            resolve();
        }, 100);
    });
}

async function quickSort(start, end) {
    if (start < end && sorting) {
        const bars = document.getElementsByClassName('bar');
        
        // Choose pivot as the last element
        const pivot = array[end];
        bars[end].style.backgroundColor = 'purple'; // Highlight pivot
        
        let i = start - 1; // Index of smaller element
        
        for (let j = start; j < end && sorting; j++) {
            comparisons++;
            updateStats();
            bars[j].style.backgroundColor = 'red'; // Current element being compared
            
            if (array[j] < pivot) {
                i++;
                await swap(i, j);
                renderArray();
                bars[i].style.backgroundColor = 'orange'; // Elements less than pivot
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            if (j !== i) bars[j].style.backgroundColor = 'var(--primary-color)';
        }
        
        await swap(i + 1, end);
        renderArray();
        
        // Reset colors
        for (let k = start; k <= end; k++) {
            bars[k].style.backgroundColor = 'var(--primary-color)';
        }
        
        // Recursively sort the sub-arrays
        await quickSort(start, i);
        await quickSort(i + 2, end);
    }
}

async function mergeSort(start, end) {
    if (!sorting) return;
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    
    // Recursively split the array
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    
    // Merge the sorted halves
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    if (!sorting) return;
    
    const bars = document.getElementsByClassName('bar');
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);
    
    let i = 0; // Index for left array
    let j = 0; // Index for right array
    let k = start; // Index for merged array
    
    // Highlight the subarrays being merged
    for (let x = start; x <= end; x++) {
        bars[x].style.backgroundColor = 'purple';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    while (i < leftArray.length && j < rightArray.length && sorting) {
        comparisons++;
        updateStats();
        // Highlight elements being compared
        bars[start + i].style.backgroundColor = 'red';
        bars[mid + 1 + j].style.backgroundColor = 'red';
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        
        // Update visualization
        renderArray();
        k++;
        
        // Reset colors
        for (let x = start; x <= end; x++) {
            bars[x].style.backgroundColor = 'purple';
        }
    }
    
    // Copy remaining elements of leftArray
    while (i < leftArray.length && sorting) {
        array[k] = leftArray[i];
        renderArray();
        i++;
        k++;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Copy remaining elements of rightArray
    while (j < rightArray.length && sorting) {
        array[k] = rightArray[j];
        renderArray();
        j++;
        k++;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Mark the merged section as sorted
    for (let x = start; x <= end; x++) {
        bars[x].style.backgroundColor = 'var(--primary-color)';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateArray();
    
    // Add window resize listener for responsive bar width
    window.addEventListener('resize', () => {
        if (!sorting) {
            renderArray();
        }
    });
});

// Handle array size slider input event
document.addEventListener('input', (e) => {
    if (e.target.id === 'arraySize') {
        updateArraySize(e.target.value);
    }
});
