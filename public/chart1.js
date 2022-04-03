let labels1 = ['Data Engineer', 'Data Scientist', 'Datawarehouse Architect', 'Data Analyst', 'Business Analyst'];
let data1 = [129609, 121674, 134373, 75300, 80025];
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