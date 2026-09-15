pipeline {

    agent any

    environment {

        AWS_REGION = 'us-east-1'

        AWS_ACCOUNT_ID = '889038136848'

        ECR_REPOSITORY = 'day8-jenkins-app'

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        IMAGE_NAME = "${ECR_REGISTRY}/${ECR_REPOSITORY}"

        ECS_CLUSTER = 'day9-jenkins-cluster'

        ECS_SERVICE = 'day9-jenkins-service'

        ECS_TASK_FAMILY = 'day9-jenkins-app'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('AWS ECR Login') {
            steps {

                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                     credentialsId: 'jenkins-ecr-user']
                ]) {

                    sh '''
                        aws ecr get-login-password \
                        --region $AWS_REGION | \
                        docker login \
                        --username AWS \
                        --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {

                sh '''
                    docker build \
                    -t $IMAGE_NAME:$BUILD_NUMBER .
                '''
            }
        }

        stage('Docker Push') {
            steps {

                sh '''
                    docker push \
                    $IMAGE_NAME:$BUILD_NUMBER
                '''
            }
        }

        stage('Deploy to ECS') {

    steps {

        withCredentials([
            [$class: 'AmazonWebServicesCredentialsBinding',
             credentialsId: 'jenkins-ecr-user']
        ]) {

            sh '''
                echo "Deploying image: $IMAGE_NAME:$BUILD_NUMBER"

                aws ecs describe-task-definition \
                --task-definition $ECS_TASK_FAMILY \
                --region $AWS_REGION \
                > task-definition.json

                python3 - <<PY
import json

with open("task-definition.json") as f:
    data = json.load(f)

task = data["taskDefinition"]

task["containerDefinitions"][0]["image"] = "$IMAGE_NAME:$BUILD_NUMBER"

output = {
    "family": task["family"],
    "taskRoleArn": task.get("taskRoleArn"),
    "executionRoleArn": task.get("executionRoleArn"),
    "networkMode": task.get("networkMode"),
    "containerDefinitions": task["containerDefinitions"],
    "requiresCompatibilities": task.get("requiresCompatibilities"),
    "cpu": task.get("cpu"),
    "memory": task.get("memory")
}

with open("new-task-definition.json", "w") as f:
    json.dump(output, f)
PY

                echo "Registering new ECS task definition..."

                aws ecs register-task-definition \
                --cli-input-json file://new-task-definition.json \
                --region $AWS_REGION \
                > registered-task.json

                NEW_TASK_DEFINITION=$(python3 -c \
                "import json; print(json.load(open('registered-task.json'))['taskDefinition']['taskDefinitionArn'])")

                echo "New task definition:"
                echo "$NEW_TASK_DEFINITION"

                echo "Updating ECS service..."

                aws ecs update-service \
                --cluster $ECS_CLUSTER \
                --service $ECS_SERVICE \
                --task-definition $NEW_TASK_DEFINITION \
                --region $AWS_REGION

                echo "Waiting for ECS service..."

                aws ecs wait services-stable \
                --cluster $ECS_CLUSTER \
                --services $ECS_SERVICE \
                --region $AWS_REGION

                echo "ECS deployment completed successfully!"
            '''
        }
    }
}

        stage('Success') {
            steps {

                echo "======================================"
                echo "CI/CD DEPLOYMENT SUCCESSFUL"
                echo "Image: $IMAGE_NAME:$BUILD_NUMBER"
                echo "ECS Cluster: $ECS_CLUSTER"
                echo "ECS Service: $ECS_SERVICE"
                echo "======================================"
            }
        }
    }
}
