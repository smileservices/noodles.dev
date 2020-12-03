import React, {useState, useEffect, Fragment} from 'react';
import ReactDOM from 'react-dom';
import apiList from "../../../src/api_interface/apiList";
import Alert from "../../../src/components/Alert";
import PaginatedLayout from "../../../src/components/PaginatedLayout";

import SolutionItem from "../../../dashboard/src/components/SolutionItem";
import ProblemItem from "../../../dashboard/src/components/ProblemItem";
import TechItem from "../../../dashboard/src/components/TechItem";
import ActivityItem from "../components/ActivityItem";

function App() {
    const [problems, setProblems] = useState([]);
    const [problemsAlert, setProblemsAlert] = useState(false);
    const [problemsWaiting, setProblemsWaiting] = useState(false);

    const [solutions, setSolutions] = useState([]);
    const [solutionsAlert, setSolutionsAlert] = useState(false);
    const [solutionsWaiting, setSolutionsWaiting] = useState(false);

    const [technologies, setTechnologies] = useState([]);
    const [technologiesAlert, setTechnologiesAlert] = useState(false);
    const [technologiesWaiting, setTechnologiesWaiting] = useState(false);

    const [activity, setActivity] = useState([]);
    const [activityAlert, setActivityAlert] = useState(false);
    const [activityWaiting, setActivityWaiting] = useState(false);

    const [users, setUsers] = useState([])


    const [problemsPagination, setProblemsPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    const [solutionsPagination, setSolutionsPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    const [technologiesPagination, setTechnologiesPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    const [activityPagination, setActivityPagination] = useState({
        resultsPerPage: 5,
        current: 1,
        offset: 0
    });

    useEffect(() => {
        apiList(
            PROBLEM_ENDPOINT,
            problemsPagination,
            setProblems,
            setProblemsWaiting,
            err => setProblemsAlert(<Alert close={e => setProblemsAlert(null)} text={err} type="danger"/>)
        )
    }, [problemsPagination])

    useEffect(() => {
        apiList(
            SOLUTION_ENDPOINT,
            solutionsPagination,
            setSolutions,
            setSolutionsWaiting,
            err => setSolutionsAlert(<Alert close={e => setSolutionsAlert(null)} text={err} type="danger"/>)
        )
    }, [solutionsPagination])

    useEffect(() => {
        apiList(
            TECH_ENDPOINT,
            technologiesPagination,
            setTechnologies,
            setSolutionsWaiting,
            err => setTechnologiesAlert(<Alert close={e => setTechnologiesAlert(null)} text={err} type="danger"/>)
        )
    }, [technologiesPagination])

    //todo latest activity
    useEffect(() => {
        apiList(
            ACTIVITY_ENDPOINT,
            activityPagination,
            setActivity,
            setActivityWaiting,
            err => setActivityAlert(<Alert close={e => setActivityAlert(null)} text={err} type="danger"/>)
        )
    }, [activityPagination])

    //todo users: get latest registered

    return (
        <Fragment>
            <div id="activity">
                <section id="latest-activity">
                    <h3>Latest Activity</h3>
                    {activityWaiting}
                    {activityAlert}
                    <PaginatedLayout data={activity.results} resultsCount={activity.count}
                                     pagination={activityPagination}
                                     setPagination={setActivityPagination}
                                     resultsContainerClass="tile-container"
                                     mapFunction={
                                         (item, idx) => <ActivityItem key={"activity" + item.pk} data={item}/>
                                     }
                    />
                </section>
            </div>
            <div id="added">
                <section id="problems">
                    <h3>Latest Problems</h3>
                    {problemsWaiting}
                    {problemsAlert}
                    <PaginatedLayout data={problems.results} resultsCount={problems.count}
                                     pagination={problemsPagination}
                                     setPagination={setProblemsPagination}
                                     resultsContainerClass="tile-container"
                                     mapFunction={
                                         (item, idx) => <ProblemItem key={"problem" + item.pk} data={item}/>
                                     }
                    />
                </section>
                <section id="solutions">
                    <h3>Latest Solutions</h3>
                    {solutionsWaiting}
                    {solutionsAlert}
                    <PaginatedLayout data={solutions.results} resultsCount={solutions.count}
                                     pagination={solutionsPagination}
                                     setPagination={setSolutionsPagination}
                                     resultsContainerClass="tile-container"
                                     mapFunction={
                                         (item, idx) => <SolutionItem key={"solution" + item.pk} data={item}/>
                                     }
                    />
                </section>
                <section id="technologies">
                    <h3>Latest Technologies</h3>
                    {technologiesWaiting}
                    {technologiesAlert}
                    <PaginatedLayout data={technologies.results} resultsCount={technologies.count}
                                     pagination={technologiesPagination}
                                     setPagination={setTechnologiesPagination}
                                     resultsContainerClass="tile-container"
                                     mapFunction={
                                         (item, idx) => <TechItem key={"solution" + item.pk} data={item}/>
                                     }
                    />
                </section>
            </div>
        </Fragment>
    )
}

ReactDOM.render(<App/>, document.getElementById('latest-activity'));