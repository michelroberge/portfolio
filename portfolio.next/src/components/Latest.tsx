export default function Latest () {
    return <div className="border rounded-lg shadow p-4 mb-2">
        {/* <p className="text-red-900 text-sm"><strong>IMPORTANT:</strong>&nbsp;Due to special circumstances, I had to take my LLM server down temporarily (assigned to different tasks). I will remove this banner when it is back online.</p> */}
        <p className="text-blue-600 text-sm"><strong>Disclaimer:</strong>
        <span>This web site is an experiment to present some <strong>personal</strong> projects 
        I worked on. Unfortunately, I am not allowed to share details about my professional projects on this site as I do not have authorization to.</span>
        </p>
        <p className="text-blue-600 text-sm">Also, please be patient with the Chatbot (bottom right). I am tuning it, and it runs on a <strong>single</strong> RTX 3060 ti, so it has a hard time to keep up.        
        </p>
        <p className="text-sm hover:underline pt-1"><a href="pages/portfolio-project">Read more about this project</a></p>
    </div>
}