pipeline {

    agent any

    environment {

        // ==============================
        // AWS Configuration
        // ==============================

        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '889038136848'

        // ==============================
        // ECR Configuration
        // ==============================

        ECR_REPOSITORY = 'day8-jenkins-app'

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

        IMAGE_NAME = "${ECR_REGISTRY}/${ECR_REPOSITORY}"

        // ==============================
        // ECS Configuration
        // ==============================

        ECS_CLUSTER = 'day9-jenkins-cluster'

        ECS_SERVICE = 'day9-jenkins-service'

        ECS_TASK_FAMILY = 'day9-jenkins-app'
    }

    stages {

        // ==========================================
        // Stage 1: Checkout
        // ==========================================

        stage('Checkout') {

            steps {

                echo 'Checking out source code...'

                checkout scm
            }
        }

        // ==========================================
        // Stage 2: AWS ECR Login
        // ==========================================

        stage('AWS ECR Login') {

            steps {

                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'jenkins-ecr-user'
                    ]
                ]) {

                    sh '''
                        echo "Logging in to AWS ECR..."

                        aws ecr get-login-password \
                        --region $AWS_REGION | \
                        docker login \
                        --username AWS \
                        --password-stdin $ECR_REGISTRY
                    '''
                }
            }
        }

        // ==========================================
        // Stage 3: Docker Build
        // ==========================================

        stage('Docker Build') {

            steps {

                echo "Building Docker image: $IMAGE_NAME:$BUILD_NUMBER"

                sh '''
                    docker build \
                    -t $IMAGE_NAME:$BUILD_NUMBER .
                '''
            }
        }

        // ==========================================
        // Stage 4: Docker Push
        // ==========================================

        stage('Docker Push') {

            steps {

                echo "Pushing Docker image to ECR..."

                sh '''
                    docker push \
                    $IMAGE_NAME:$BUILD_NUMBER
                '''
            }
        }

        // ==========================================
        // Stage 5: Deploy to ECS
        // ==========================================

        stage('Deploy to ECS') {

            steps {

                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'jenkins-ecr-user'
                    ]
                ]) {

                    sh '''
                        echo "=========================================="
                        echo "Starting ECS Deployment"
                        echo "=========================================="

                        echo "Image:"
                        echo "$IMAGE_NAME:$BUILD_NUMBER"

                        echo "AWS Region:"
                        echo "$AWS_REGION"

                        echo "ECS Cluster:"
                        echo "$ECS_CLUSTER"

                        echo "ECS Service:"
                        echo "$ECS_SERVICE"

                        echo "Task Family:"
                        echo "$ECS_TASK_FAMILY"

                        echo "=========================================="

                        # ------------------------------------------
                        # Get Current ECS Task Definition
                        # ------------------------------------------

                        echo "Getting current ECS task definition..."

                        aws ecs describe-task-definition \
                        --task-definition $ECS_TASK_FAMILY \
                        --region $AWS_REGION \
                        > task-definition.json

                        echo "Current task definition retrieved successfully."

                        # ------------------------------------------
                        # Create New Task Definition JSON
                        # ------------------------------------------

                        echo "Creating new task definition..."

                        python3 - <<PY
import json

with open("task-definition.json") as f:
    data = json.load(f)

task = data["taskDefinition"]

# Update Docker image
task["containerDefinitions"][0]["image"] = "$IMAGE_NAME:$BUILD_NUMBER"

# Create new task definition
output = {
    "family": task["family"],
    "executionRoleArn": task["executionRoleArn"],
    "networkMode": task["networkMode"],
    "containerDefinitions": task["containerDefinitions"],
    "requiresCompatibilities": task["requiresCompatibilities"],
    "cpu": task["cpu"],
    "memory": task["memory"]
}

# Add taskRoleArn only if it exists
if task.get("taskRoleArn"):
    output["taskRoleArn"] = task["taskRoleArn"]

# Save new task definition
with open("new-task-definition.json", "w") as f:
    json.dump(output, f, indent=2)

print("New ECS task definition created successfully.")
print(json.dumps(output, indent=2))
PY

                        # ------------------------------------------
                        # Register New Task Definition
                        # ------------------------------------------

                        echo "=========================================="
                        echo "Registering new ECS task definition..."
                        echo "=========================================="

                        aws ecs register-task-definition \
                        --cli-input-json file://new-task-definition.json \
                        --region $AWS_REGION \
                        > registered-task.json

                        # ------------------------------------------
                        # Get New Task Definition ARN
                        # ------------------------------------------

                        NEW_TASK_DEFINITION=$(python3 -c \
                        "import json; print(json.load(open('registered-task.json'))['taskDefinition']['taskDefinitionArn'])")

                        echo "New task definition:"
                        echo "$NEW_TASK_DEFINITION"

                        # ------------------------------------------
                        # Update ECS Service
                        # ------------------------------------------

                        echo "=========================================="
                        echo "Updating ECS service..."
                        echo "=========================================="

                        aws ecs update-service \
                        --cluster $ECS_CLUSTER \
                        --service $ECS_SERVICE \
                        --task-definition $NEW_TASK_DEFINITION \
                        --region $AWS_REGION

                        echo "ECS service update requested successfully."

                        # ------------------------------------------
                        # Wait for ECS Service
                        # ------------------------------------------

                        echo "=========================================="
                        echo "Waiting for ECS service to become stable..."
                        echo "=========================================="

                        aws ecs wait services-stable \
                        --cluster $ECS_CLUSTER \
                        --services $ECS_SERVICE \
                        --region $AWS_REGION

                        echo "=========================================="
                        echo "ECS deployment completed successfully!"
                        echo "=========================================="
                    '''
                }
            }
        }

        // ==========================================
        // Stage 6: Success
        // ==========================================

        stage('Success') {

            steps {

                echo "=========================================="
                echo "CI/CD DEPLOYMENT SUCCESSFUL"
                echo "=========================================="

                echo "Docker Image:"
                echo "$IMAGE_NAME:$BUILD_NUMBER"

                echo "ECS Cluster:"
                echo "$ECS_CLUSTER"

                echo "ECS Service:"
                echo "$ECS_SERVICE"

                echo "Deployment completed successfully!"

                echo "=========================================="
            }
        }
    }

    // ==========================================
    // Post Actions
    // ==========================================

    post {

        success {

            echo "=========================================="
            echo "Jenkins Day 9 Pipeline SUCCESS"
            echo "=========================================="
        }

        failure {

            echo "=========================================="
            echo "Jenkins Day 9 Pipeline FAILED"
            echo "Check the console output for details."
            echo "=========================================="
        }
    }
}
