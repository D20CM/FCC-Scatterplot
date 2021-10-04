
let bikeDoping = function () {

    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
        .then(response => response.json())
        .then(data => {

           
            console.log(data);

            
            
            let datesArr = data.map(element => (element.Year));
            // console.log(datesArr);

            let yearsArr = datesArr.map(element => new Date (element,0).getFullYear());
            // console.log(yearsArr);

            // let yearsOnlyArr = yearsArr.map(element => element.getFullYear());
            // console.log(yearsOnlyArr);

            let earliestDate = d3.min(yearsArr);
            // console.log(earliestDate);

            let latestDate = d3.max(yearsArr);
            // console.log(latestDate);
            
       
            
            
            
            
            let timesArr = data.map(element => element.Time)
            // console.log(timesArr);
         
            let fastestTime = d3.min(timesArr);
            // console.log(fastestTime);
           
            let slowestTime = d3.max(timesArr);
            // console.log(slowestTime);

            let splitTime = fastestTime.split(":");
            let fastestTimeAsDate = new Date (1994, 0, 0, 0, splitTime[0], splitTime[1], 0)
            // console.log(fastestTimeAsDate.getMinutes() + ":" + fastestTimeAsDate.getSeconds());
            
            let timesAsDatesArr = [];

            timesArr.forEach(
                element => {
                    let splitTime = element.split(":");
                    let elementAsDate = new Date (1994, 0, 1, 0, splitTime[0], splitTime[1]);
                    timesAsDatesArr.push(elementAsDate);
                }
            )
            
            console.log(typeof(data[0].Time));
            console.log(typeof(timesAsDatesArr[1]));

            for (let i = 0; i<data.length; i++){
                data[i].Time = timesAsDatesArr[i];
            }

            console.log(data);
            console.log(typeof(data[0].Time));

            let h=400
            let w=800
            let padding=60;

            const svg = d3.select("#chart-container")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class","svg");

         

            let xScale = d3.scaleTime()
                            // .domain([new Date ((d3.min(datesArr)),0), new Date ((d3.max(datesArr)),0)])
                            .domain([earliestDate-1, latestDate+1])
                            .range([padding, w-padding])
                            
                          

            let yScale = d3.scaleTime()
                            .domain([d3.max(timesAsDatesArr), d3.min(timesAsDatesArr)])
                            .range([h - padding, padding])
                           
                            
            

                           
            const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('1994'))
            const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

            svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .call(xAxis);
        
            svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);






            // yearsArr.forEach(element => console.log(element));


            // console.log(yScale(new Date (data[2].Time)))
            // console.log(yScale(new Date (data[2].Seconds)))
            // console.log(xScale(new Date (data[2].Year)))
            // console.log(d3.min(timesAsDatesArr))

            let tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "LightGray")
            .style("opacity", 0.95)
            .style("border-radius", 10+"px")
            .style( "font-family", "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif")
            .style("font-size", "0.8em")
            .style("text-align", "left")

            


            svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", (d) => xScale(d.Year))
            .attr("cy",(d) => yScale(d.Time))
            .attr("r",  5)
            .attr("data-xvalue", (d) => d.Year)
            .attr("data-yvalue", (d) => d.Time)
            .style("fill", (d) => d.Doping == "" ? "blue" : "red")
            .on("mouseover", function(e,d){
                
                tooltip.html(function(){
                    return d.Name + ": " + d.Nationality + "<br>" + "Year: " + d.Year + "<br>" + "Time: " + d.Time.getMinutes() + ":" + d.Time.getSeconds().toString().padStart(2,"0") + "<br>" + "<br>"+ d.Doping

                });
                return tooltip.style("visibility","visible")
                                .attr("data-year", d.Year)
                                .style("padding", 20+"px")
                                
                                
            })
            .on("mousemove", function(event, d){
                return tooltip
                            .style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px")
            })
            .on("mouseout", function(){
                return tooltip.style("visibility","hidden")
            })


            const legend = d3.select("svg")
                .append("g")
                .attr("id", "legend")
                .attr("x", w-180)
                .attr("y", 120)
                .attr("height", 100)
                .attr("width", 160)
                .style("background-color", "red")
                .attr("z-index", 10)

               

           legend
            .append("text")
            .attr("class", "legend-text")   
            .style("text-anchor", "end")
            .attr("x", w-120)
            .attr("y", 160)
            .text("No Doping Allegations")
            .attr("z-index", 2000)

           legend
            .append("text")
            .attr("class", "legend-text")   
            .style("text-anchor", "end")
            .attr("x", w-120)
            .attr("y", 180)
            .text("Riders With Doping Allegations")
            .attr("z-index", 2000)


            legend
            .append("rect")
            .attr("class", "legend-block-dope")
            .attr("height", "10px")
            .attr("width","10px")
            .attr("x", w-110)
            .attr("y", 172)
          
            legend
            .append("rect")
            .attr("class", "legend-block-no-dope")
            .attr("height", "10px")
            .attr("width","10px")
            .attr("x", w-110)
            .attr("y", 152)


        //  svg.selectAll("text")
        //     .data(data)
        //     .enter()
        //     .append("text")
        //     .text((d) =>  (d[0] + "," + d[1]))
        //     .attr("x", (d) => xScale(d[0] + 10))
        //     .attr("y", (d) => yScale(d[1]))
     


      













        }
        )
}

bikeDoping();