import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "../page/home";
import Collection from "../page/collection";
import '../style/css/app.css';
import { useState } from "react";
export default function App() {

    const [modifyPlan, setModifyPlan] = useState<any>(null);

    const propFunc = (data: any) => {
        setModifyPlan(data)
    }
    return (
        <Router>
            <div className='app'>
                <div className='navList'>
                    <ul>
                        <li><Link to='/'>新增抽奖方案</Link></li>
                        <li><Link to='/collection'>抽奖方案汇总</Link></li>
                    </ul>
                </div>
                <div className='mainWrapper'>
                    <Switch>
                        <Route exact path='/'>
                            <Home modifyPlan={modifyPlan} />
                        </Route>
                        <Route path='/collection'>
                            <Collection func={propFunc} />
                        </Route>
                       
                    </Switch>
                </div>
            </div>
        </Router>
    )
}