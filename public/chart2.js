let labels1 = ['Cloud Architect', 'Cloud Engineer', 'Cloud Security Engineer', 'Cloud Application Developer', 'DevOps Engineer'];
let data1 = [168500, 127500, 114420, 97000, 101638];
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