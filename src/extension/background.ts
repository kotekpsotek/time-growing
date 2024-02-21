import { timeToNextGrowth } from "$lib";

const progressDisplayElement = document.getElementById("timenxt-1/2")!;
setInterval(() => {
    console.log("Element", progressDisplayElement)
})
timeToNextGrowth(progressDisplayElement);
