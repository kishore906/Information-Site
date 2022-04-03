let labels1 = ['Switzerland', 'Australia', 'United States', 'Denmark', 'Germany'];
let data1 = [63546, 52717, 50900, 47775, 45108];
let colors1 = ['#49A9EA', '#36CAAB', '#34495E', '#9ACD32', '#FFE4C4'];   

let linechart = document.getElementById('myChart').getContext('2d');

let chart = new Chart(linechart, {
    
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: labels1,
        datasets: [{
            
            data: data1,
            backgroundColor: colors1
        }]
    },
    
    options: {
        
        title: {
            
            text: "Salary in Dollars(USD)",
            display: true,
            fontSize: 20
        },
        
        legend: {
            
            display: false
        }
    }

});