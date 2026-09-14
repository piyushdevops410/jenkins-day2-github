\pipeline {

    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPOSITORY = 'day8-jenkins-app'
        AWS_ACCOUNT_ID = '889038136848'
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_NAME = "${ECR_REGISTRY}/${ECR_REPOSITORY}"
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
                    docker push $IMAGE_NAME:$BUILD_NUMBER
                '''
            }
        }

        stage('Success') {
            steps {
                echo "Image pushed successfully!"
                echo "Image: $IMAGE_NAME:$BUILD_NUMBER"
            }
        }
    }
}
