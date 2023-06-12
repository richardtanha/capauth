using { riskmanagement as rm } from '../db/schema';
 @path: 'service/risk'
 service RiskService @(requires: 'authenticated-user'){
 entity Risks @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'RiskViewer' ]
            },
            {
                grant : [ '*' ],
                to : [ 'RiskManager' ],
                //where: 'createdBy = $user'
            }
        ]) as projection on rm.Risks;
  entity Mitigations @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'RiskManager' ]
            },
            {
                grant : [ '*' ],
                to : [ 'RiskManager' ]
            }
        ]) as projection on rm.Mitigations;
 }