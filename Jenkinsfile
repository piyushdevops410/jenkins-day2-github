pipeline {

    agent any

    environment {
        APP_NAME = 'jenkins-day5-app'
    }

    stages {

        stage('Information') {
            steps {
                echo '========================================'
                echo 'Jenkins Day 5 - Credentials Lab'
                echo '========================================'

                echo "Application: ${env.APP_NAME}"
                echo "Build Number: ${env.BUILD_NUMBER}"
                echo "Workspace: ${env.WORKSPACE}"
            }
        }

        stage('Build') {
            steps {
                echo '========================================'
                echo 'Build Stage'
                echo '========================================'

                sh 'ls -la'
            }
        }

        stage('Credentials Test') {
            steps {
                echo '========================================'
                echo 'Credentials Test'
                echo '========================================'

                withCredentials([
                    string(
                        credentialsId: 'day5-test-secret',
                        variable: 'MY_SECRET'
                    )
                ]) {
                    sh '''
                        echo "Credential is available to the Pipeline"
                        echo "Secret length:"
                        echo -n "$MY_SECRET" | wc -c
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                echo '========================================'
                echo 'Test Stage'
                echo '========================================'

                sh 'test -f index.html'

                echo 'Application test passed!'
            }
        }
    }

    post {

        always {
            echo '========================================'
            echo 'Pipeline Finished'
            echo '========================================'
        }

        success {
            echo 'SUCCESS: Credentials lab completed!'
        }

        failure {
            echo 'FAILURE: Pipeline failed!'
        }
    }
}
