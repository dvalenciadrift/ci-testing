# How to use this repo

This repo includes the baseline Terraform/Atmos and Javascript files necessary to spool up an AWS Lambda function running Node.js 16.x.  The intent is to provide a pre-built foundation so you can focus on creating the the parts of your application that are unique to the custom integration rather than the AWS infrastructure and config.  These instructions assume you've completed Drift Engineering onboarding steps that include AWS setup and installing the Drift CLI.

Basic steps to use this repo are detailed below in the following order:
- Fork the repo (don't clone)
- Setup Terraform/Atmos
- Test locally
- Deploy to AWS

## Fork the repo

We don't want to make changes to this baseline repo, so instead create a copy.  Due to Drift's security policies (you can't use the Git fork command to copy a repo into another repo in the Driftt Github) this is most easily accomplished manually.  First, create a new repo using [drifttools.com](https://drifttools.com/create/templates/default/empty-repository). 

Set the name, description and owner fields.  For the name, use the convention ```pse-concise-app-name```, such as _pse-aws-lambda-baseline_.

Clone your new repo locally then download the code in this repo as a zip file, unzip and copy the files to your newly cloned directory. **Do not include the atmos directory when copying the files.**  Commit and push your changes to the remote repo.  Create a new branch within your newly created Driftt repo to start customizing your app.

## Update Terraform files
To set some of the basic configuration for your AWS infrastructure, you need to update several Atmos/Terraform files.  Make sure you make the changes below in your NEW repo.

1. In order to play nicely with some of the automation already built by Drift Devops, we need to **DELETE** the entire atmos directory (if you included it when copying the files from the .zip).  Then, from the top level of your directory, run ```drift create-atmos-config``` to generate boilerplate atmos directories.

- The command will prompt you for several inputs.  Suggested values are:
  * Service Name: your-app-name (do not include the "pse" preface)
  * Included Atmos modules: [use the space bar to deselect "kube"]
  * Deploy to EU region in Prod: No
  * Run atmos apply in qa: No
  * Ingress Type: select "No HTTP access"

2. You should now have an atmos folder in your top level directory.  Navigate to *atmos>config>atmos>environments* and open *qa.yml*.  Add the key and value for *app_name*.  Do not include "pse" prefix in your app name, or the environment (such as qa or prod) as these are added via the code.  Your file should look similar to below:  
![image](https://user-images.githubusercontent.com/9735257/188014863-5485028a-3dbe-4482-a096-94e272c6c74d.png)

    `NOTE`: your app name cannot have spaces or special characters.  Follow the format of *your-app-name*. 
    
3. Update the *prod.yml* file similarly.  Use the same app name value in the *prod.yml* file.
![image](https://user-images.githubusercontent.com/9735257/188015108-a9e1904b-1897-42f1-89d6-feb4dbfd5e02.png)


4. Navigate to atmos>recipes.  You should have two separate .tf files named _your-app-name-base.tf_ and *your-app-name-kube-base.tf*.  **Delete** the file ending in *-kube-base.tf* and replace with an new, empty file named *your-app-name.tf*.  Copy and paste the contents from the *service-PSE AWS LAMBDA BASELINE.tf* in this repo.  Your file should look similar to below: 
![image](https://user-images.githubusercontent.com/9735257/188015461-a6fb652a-5101-4bb3-82b5-327c7f493d85.png)


5. Navigate to atmos>recipes>variables.tf and add the following to the end of the file: 
```
variable "app_name" {
  description = "Name of your custom app"
}
```
__Note__: "app_name" is required as your App's name is used as a key value for credential retrieval.  The value for "app_name" is supplied by the .yaml edits you made in steps 2 and 3 above.  

6. Lastly, we need to tell Atmos which .tf files to reference.  Navigate to atmos>config>atmos>recipes.yml and delete the reference to the *-kube-base.tf* and replace with the file name of the new .tf recipe you just created.  See below:
![image](https://user-images.githubusercontent.com/9735257/187780664-fd464b50-ed04-4b8e-a768-24b89cb5a1b5.png)

6. Validate your Terraform/Atmos configuration at this point by running the following from within the atmos directory:
```atmos -e qa init```

    `Note`: if you encounter an ```(Errno::EEXIST)``` error upon running the init command, try the following command:
```rm -rf ~/.terraform.d/ tmp atmos.log```

    Then re-run the init command.  A successful init should return the following to your terminal: 
    ![image](https://user-images.githubusercontent.com/9735257/187800197-f1f992cc-a284-4abc-996f-52c078e61520.png)

    Once the init is completed run: ```atmos -e qa plan```.  If your setup is correct, a Terraform plan should be returned in your terminal that looks similar to the following: 
    ![image](https://user-images.githubusercontent.com/9735257/187801765-8ce0d88e-1b85-48b3-9fb1-9f1eddfeacdd.png)
    

## Test locally
Before running the app, you'll need to install the required Node dependencies.  From the top level directory run ```npm install```. You'll also need a *.env* file created in the top level directory.  For local dev, we use the dotenv package to manage secrets.  

Create a *.env* file but use the `/setEnvironment.js` file to set the values of any enviromnment variables.  This allows the environment variables to be dynamically set based on whether the app is running locally, from AWS QA ro AWS PROD.

Then, to test the app locally, simply run ```node ./local/local.js``` from the top level directory.  This will simulate an AWS API Gateway event to your ```lambda.js``` entry file.  

If you prefer to process events from external systems (like post requests from a Drift webhook), open a new terminal session and start an NGROK tunnel on port 3000 ```ngrok http 3000```.  Run ```node app.js``` to spool up your express server and begin receiving external requests to your locally running code.

Pass the NGROK URL to your Drift App, ensure you've subscribed to the correct events, then test your app by triggering an event or simulating an event via Postman.  With debugger enabled in VSCode you can add breakpoints to help troubleshoot and debug.

`Note`: you may need to uninstall and re-install your Drift app to reset the webhooks and endpoint URL.

`Note 2:` The file `./services/getToken.js` provides an example network call to retrieve app credentials from the pse-marketplace-app auth server if needed.  Use the marketplace-app auth server approach if you intend to install this custom app on multiple orgs.

## Deploy to AWS
Once your app is running smoothly locally, it's time to deploy to AWS (first qa then prod).    

Run ```./deploy.sh qa``` from the top level directory.  When ready to deploy to prod, simply change the parameter from "qa" to "prod" as such: ```./deply.sh prod```  You may need to allow this shell file to be executable by running ```chmod +x deploy.sh``` first.

The shell script zips the contents of your repo and sends them to a shared S3 bucket that holds the zipped code contents of other PSE Lambda functions.  Once the zip file is sent to AWS, the script will execute an ```atmos -e qa apply``` or ```atmos -e prod apply```  from the atmos sub-directory.  If there are no errors, and the terraform plan is as exepcted, confirm the apply by entering *yes* when prompted.  You should see output similar to the following:
![image](https://user-images.githubusercontent.com/9735257/187807831-640ef723-0374-4ec8-8db4-db88e59377b6.png)

Take note of the invoke URL provided... this is your new webhook URL for your Drift app.  You'll need to append the /drift route to this URL before sharing it with your Drift app.  In this example, you would give your Drift App a webhook endpoint of ```https://64v2n45.execute-api.us-east-1.amazonaws.com/<ENV>/{proxy+}```.  

`Note:` The URL provided by the terraform output provides a _single_ base url to access your app.  However, because this app uses an express server, any number of additional routes can be built _within_ your app via the express server toolkit.  The `{proxy+}` in the example URL above represents those 'sub' paths created by your express server.  For example, if your app has a route 
```
app.post('/your_route', yourService)
```
 the full URL to send data to this endpoint would be 
 ```
 https://64v2n45.execute-api.us-east-1.amazonaws.com/<ENV>/your_route
 ```
  where `<ENV>` is either "qa" or "prod" depending on the environment.

Finally, the script updates the connection between your new lambda function and the .zip file in the S3 bucket.

**Congrats!**  You now have a lambda function and API Gateway endpoint running on AWS.

Testing your app is done similarly to when developing locally, except now your logs are viewable in the AWS console.  Trigger your app with a Drift event or via Postman.  Then navigate to the lambda function via the AWS console under your qa or prod profile in AWS.  Click on Monitor tab, then "View Logs in Cloudwatch" to see the output of your lambda function.  

`Note`: You cannot set breakpoints when running your app from a lambda function.  Console.log() can be useful.

`Note`: If you make changes to the app code, you must run the deploy-qa.sh script in order for those changes to be pushed to AWS. 

**IMPORTANT** If you've followed along for training (vs building a custom app), please delete your AWS infrastructure simply by commenting out the entire contents of *your-app-name.tf* and re-running ```atmos -e qa apply``` and confirm the removal of all resources.

A video walkthrough of this entire process is [here](https://video.drift.com/v/abqXCQCusGT/).

Additional notes available [here](https://docs.google.com/document/d/1uwxBAlfB2Y9hhc6sE7oX5uP-fQaUBun_BSh0Q008xYQ/edit).